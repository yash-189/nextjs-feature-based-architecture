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
  orders: {
    list: "/orders",
    one: (id: string) => `/orders/${encodeURIComponent(id)}`,
    payments: (id: string) => `/orders/${encodeURIComponent(id)}/payments`,
  },
} as const;
