import { customers } from "./customers";

export type MockOrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface MockOrder {
  id: string;
  number: string;
  customerId: string;
  status: MockOrderStatus;
  total: number;
  createdAt: string;
}

export interface MockPayment {
  id: string;
  orderId: string;
  amount: number;
  method: "card" | "bank_transfer";
  createdAt: string;
}

const STATUSES: MockOrderStatus[] = ["pending", "paid", "shipped", "cancelled"];
const HOUR_MS = 60 * 60 * 1000;
const SEED_DATE = Date.UTC(2026, 10, 1);

export const orders: MockOrder[] = Array.from({ length: 32 }, (_, i) => ({
  id: `ord_${String(i + 1).padStart(3, "0")}`,
  number: `#${1000 + i + 1}`,
  customerId: customers[(i * 7) % customers.length].id,
  status: STATUSES[i % STATUSES.length],
  total: 4900 + ((i * 3719) % 45000),
  createdAt: new Date(SEED_DATE - i * 17 * HOUR_MS).toISOString(),
}));

export const payments: MockPayment[] = orders
  .filter((order) => order.status === "paid" || order.status === "shipped")
  .map((order, i) => ({
    id: `pay_${String(i + 1).padStart(3, "0")}`,
    orderId: order.id,
    amount: order.total,
    method: i % 3 === 0 ? "bank_transfer" : "card",
    createdAt: new Date(Date.parse(order.createdAt) + HOUR_MS).toISOString(),
  }));
