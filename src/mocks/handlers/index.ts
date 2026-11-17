import { authHandlers } from "./auth";
import { customerHandlers } from "./customers";
import { orderHandlers } from "./orders";

export function createHandlers(baseUrl: string) {
  return [
    ...authHandlers(baseUrl),
    ...customerHandlers(baseUrl),
    ...orderHandlers(baseUrl),
  ];
}
