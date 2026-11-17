export const Endpoints = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  customers: {
    list: "/customers",
    one: (id: string) => `/customers/${encodeURIComponent(id)}`,
  },
} as const;
