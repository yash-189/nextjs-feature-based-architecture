import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { DEMO_CREDENTIALS } from "../constants";
import { db, resetDb } from "../db";
import { authHandlers } from "./auth";

const BASE = "http://api.test";
const server = setupServer(...authHandlers(BASE));

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => resetDb());
afterAll(() => server.close());

const post = (path: string, body: unknown) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("mock auth handlers", () => {
  it("issues tokens for the demo account", async () => {
    const response = await post("/auth/login", DEMO_CREDENTIALS);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("rejects a wrong password with an error code", async () => {
    const response = await post("/auth/login", {
      email: DEMO_CREDENTIALS.email,
      password: "nope",
    });
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({
      success: false,
      errorCode: "INVALID_CREDENTIALS",
    });
  });

  it("rotates refresh tokens so each works once", async () => {
    const login = await (await post("/auth/login", DEMO_CREDENTIALS)).json();
    const { refreshToken } = login.data;

    expect((await post("/auth/refresh", { refreshToken })).status).toBe(200);
    const reused = await post("/auth/refresh", { refreshToken });
    expect(reused.status).toBe(401);
    expect(await reused.json()).toMatchObject({ errorCode: "SESSION_REVOKED" });
  });

  it("rejects an expired access token", async () => {
    const login = await (await post("/auth/login", DEMO_CREDENTIALS)).json();
    const { accessToken } = login.data;
    const session = db.accessTokens.get(accessToken);
    if (session) session.expiresAt = Date.now() - 1;

    const response = await fetch(`${BASE}/auth/me`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    expect(response.status).toBe(401);
  });
});
