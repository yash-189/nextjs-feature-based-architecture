export const MOCK_LATENCY_MS = 300;

// Short on purpose, so the refresh flow runs during a normal demo session.
export const ACCESS_TOKEN_TTL_MS = 5 * 60 * 1000;

export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "password",
} as const;
