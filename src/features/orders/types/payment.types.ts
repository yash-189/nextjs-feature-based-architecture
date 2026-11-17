export type PaymentMethod = "card" | "bank_transfer";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  createdAt: string;
}
