import type { Customer } from "@/features/customers";
import type { ORDER_STATUSES } from "../constants";

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  // Amounts are in cents, as the backend sends them.
  total: number;
  createdAt: string;
  customer: Pick<Customer, "id" | "name" | "email">;
}
