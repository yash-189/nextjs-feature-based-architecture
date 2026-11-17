import { delay, HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Routes } from "../routes";
import { clientHttp } from "./client";

const server = setupServer();
const assign = vi.fn();

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
beforeEach(() => {
  vi.stubGlobal("location", { ...window.location, assign });
});
afterEach(() => {
  server.resetHandlers();
  assign.mockReset();
  vi.unstubAllGlobals();
});
afterAll(() => server.close());

const backend = (path: string) => `${Routes.backendApi}${path}`;

function protectedRoute(path: string, isSignedIn: () => boolean) {
  return http.get(backend(path), () =>
    isSignedIn()
      ? HttpResponse.json({ success: true, data: path })
      : HttpResponse.json(
          { success: false, errorCode: "UNAUTHORIZED" },
          { status: 401 },
        ),
  );
}

describe("clientHttp", () => {
  it("refreshes once for parallel 401s and retries each request", async () => {
    let signedIn = false;
    let refreshCalls = 0;
    server.use(
      protectedRoute("/a", () => signedIn),
      protectedRoute("/b", () => signedIn),
      http.post(Routes.authRefresh, async () => {
        refreshCalls += 1;
        await delay(20);
        signedIn = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const results = await Promise.all([
      clientHttp.get<string>("/a"),
      clientHttp.get<string>("/b"),
    ]);

    expect(results).toEqual(["/a", "/b"]);
    expect(refreshCalls).toBe(1);
  });

  it("sends the user to login when the refresh fails", async () => {
    server.use(
      protectedRoute("/a", () => false),
      http.post(
        Routes.authRefresh,
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    await expect(clientHttp.get("/a")).rejects.toMatchObject({ status: 401 });
    expect(assign).toHaveBeenCalledWith(Routes.login);
  });

  it("does not refresh when the session was revoked", async () => {
    const refresh = vi.fn(() => new HttpResponse(null, { status: 204 }));
    server.use(
      http.get(backend("/a"), () =>
        HttpResponse.json(
          { success: false, errorCode: "SESSION_REVOKED" },
          { status: 401 },
        ),
      ),
      http.post(Routes.authRefresh, refresh),
    );

    await expect(clientHttp.get("/a")).rejects.toMatchObject({
      code: "SESSION_REVOKED",
    });
    expect(refresh).not.toHaveBeenCalled();
    expect(assign).toHaveBeenCalledWith(Routes.login);
  });
});
