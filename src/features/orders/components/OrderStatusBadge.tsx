import { Badge } from "@/ui/primitives/badge";
import type { OrderStatus } from "../types/order.types";

const VARIANT = {
  pending: "outline",
  paid: "secondary",
  shipped: "default",
  cancelled: "destructive",
} as const;

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={VARIANT[status]} className="capitalize">
      {status}
    </Badge>
  );
}
