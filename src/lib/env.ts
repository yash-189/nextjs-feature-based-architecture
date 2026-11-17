import "server-only";
import { z } from "zod";

// Fails at startup if a variable is missing.
const schema = z.object({
  API_URL: z.url(),
  API_MOCKING: z.enum(["enabled", "disabled"]).default("disabled"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = schema.parse({
  API_URL: process.env.API_URL,
  API_MOCKING: process.env.API_MOCKING,
  NODE_ENV: process.env.NODE_ENV,
});

export const env = {
  ...parsed,
  isProduction: parsed.NODE_ENV === "production",
  isMocking: parsed.API_MOCKING === "enabled",
};
