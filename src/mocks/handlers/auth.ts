import { HttpResponse, http } from "msw";
import { bearerToken, currentUser, issueSession } from "../auth";
import { db } from "../db";
import { fail, ok } from "../respond";

export function authHandlers(baseUrl: string) {
  return [
    http.post(`${baseUrl}/auth/login`, async ({ request }) => {
      const { email, password } = (await request.json()) as {
        email?: string;
        password?: string;
      };
      const user = db.users.find(
        (candidate) =>
          candidate.email === email?.toLowerCase() &&
          candidate.password === password,
      );
      if (!user) {
        return fail(
          401,
          "INVALID_CREDENTIALS",
          "Email or password is incorrect.",
        );
      }
      return ok(issueSession(user.id));
    }),

    http.post(`${baseUrl}/auth/refresh`, async ({ request }) => {
      const { refreshToken } = (await request.json()) as {
        refreshToken?: string;
      };
      const userId = refreshToken && db.refreshTokens.get(refreshToken);
      if (!userId) {
        return fail(401, "SESSION_REVOKED", "Your session has ended.");
      }
      // Rotate: a refresh token works once.
      db.refreshTokens.delete(refreshToken);
      return ok(issueSession(userId));
    }),

    http.post(`${baseUrl}/auth/logout`, ({ request }) => {
      const token = bearerToken(request);
      if (token) db.accessTokens.delete(token);
      return new HttpResponse(null, { status: 204 });
    }),

    http.get(`${baseUrl}/auth/me`, ({ request }) => {
      const user = currentUser(request);
      if (!user) return fail(401, "UNAUTHORIZED", "Sign in to continue.");
      return ok({ id: user.id, name: user.name, email: user.email });
    }),
  ];
}
