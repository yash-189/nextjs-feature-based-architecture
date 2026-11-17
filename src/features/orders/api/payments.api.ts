import { Endpoints, type Http } from "@/lib/http";
import type { Payment } from "../types/payment.types";

export const getOrderPayments = (http: Http, orderId: string) =>
  http.get<Payment[]>(Endpoints.orders.payments(orderId));
