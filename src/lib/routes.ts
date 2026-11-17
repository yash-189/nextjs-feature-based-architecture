export const Routes = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  customers: "/customers",
  // Must match the app/api/backend folder.
  backendApi: "/api/backend",
  authRefresh: "/api/auth/refresh",
  // Must match the app/api/mock folder.
  mockApi: "/api/mock",
} as const;

export const SIGNED_IN_ROUTES = [Routes.dashboard, Routes.customers] as const;
