import { ACCESS_TOKEN_TTL_MS } from "./constants";
import { db } from "./db";

export function issueSession(userId: string) {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  db.accessTokens.set(accessToken, {
    userId,
    expiresAt: Date.now() + ACCESS_TOKEN_TTL_MS,
  });
  db.refreshTokens.set(refreshToken, userId);
  return { accessToken, refreshToken };
}

export function bearerToken(request: Request) {
  return request.headers.get("authorization")?.replace(/^Bearer /, "");
}

// Returns the signed-in user, or null when the access token is missing or
// expired. Handlers answer null with a 401 so the client refreshes.
export function currentUser(request: Request) {
  const token = bearerToken(request);
  const session = token ? db.accessTokens.get(token) : undefined;
  if (!session || session.expiresAt < Date.now()) return null;
  return db.users.find((user) => user.id === session.userId) ?? null;
}
