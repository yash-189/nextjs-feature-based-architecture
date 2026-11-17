export const Routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  // Must match the app/api/backend folder.
  backendApi: "/api/backend",
  authRefresh: "/api/auth/refresh",
} as const;

export const SIGNED_IN_ROUTES = [Routes.dashboard] as const;
