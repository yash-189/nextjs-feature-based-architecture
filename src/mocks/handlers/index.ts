import { authHandlers } from "./auth";

export function createHandlers(baseUrl: string) {
  return [...authHandlers(baseUrl)];
}
