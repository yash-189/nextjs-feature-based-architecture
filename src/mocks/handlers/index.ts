import { authHandlers } from "./auth";
import { customerHandlers } from "./customers";

export function createHandlers(baseUrl: string) {
  return [...authHandlers(baseUrl), ...customerHandlers(baseUrl)];
}
