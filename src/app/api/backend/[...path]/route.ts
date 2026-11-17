import { env } from "@/lib/env";
import { getAccessToken } from "@/lib/session";

// Browser requests to the backend go through here so the token can stay in
// an httpOnly cookie. Refreshing happens in clientHttp, not here.

type Context = { params: Promise<{ path: string[] }> };

const TIMEOUT_MS = 15_000;

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "if-modified-since",
  "if-none-match",
];

const DROPPED_RESPONSE_HEADERS = [
  "connection",
  "content-encoding",
  "content-length",
  "set-cookie",
  "transfer-encoding",
];

function backendUrl(path: string[], search: string) {
  const safePath = path.map(encodeURIComponent).join("/");
  return `${env.API_URL}/${safePath}${search}`;
}

async function handle(request: Request, { params }: Context) {
  const { path } = await params;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const token = await getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(backendUrl(path, new URL(request.url).search), {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return new Response(null, { status: 502 });
  }

  const out = new Headers(response.headers);
  for (const name of DROPPED_RESPONSE_HEADERS) out.delete(name);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: out,
  });
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
};
