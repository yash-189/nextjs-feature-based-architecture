"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";
import { formatDate } from "@/shared/utils/formatDate";
import { ErrorState } from "@/ui/components/feedback/ErrorState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { Skeleton } from "@/ui/primitives/skeleton";
import { ORDER_STATUSES } from "../constants";
import { useOrder } from "../hooks/useOrder";
import { useOrderPayments } from "../hooks/useOrderPayments";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import { formatMoney } from "../utils/formatMoney";
import { OrderStatusBadge } from "./OrderStatusBadge";

const STATUS_ITEMS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: status[0].toUpperCase() + status.slice(1),
}));

export function OrderDetailScreen({ id }: { id: string }) {
  const order = useOrder(id);
  const payments = useOrderPayments(id);
  const updateStatus = useUpdateOrderStatus(id);

  if (order.isPending) return <Skeleton className="h-64 w-full" />;
  if (order.isError) {
    return (
      <ErrorState
        title="Couldn't load this order"
        onRetry={() => order.refetch()}
      />
    );
  }

  const { data } = order;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={Routes.orders}
        className="flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        All orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-semibold text-2xl tracking-tight">
            Order {data.number}
            <OrderStatusBadge status={data.status} />
          </h1>
          <p className="text-muted-foreground text-sm">
            {data.customer.name} · {formatDate(data.createdAt)} ·{" "}
            {formatMoney(data.total)}
          </p>
        </div>
        <Select
          items={STATUS_ITEMS}
          value={data.status}
          onValueChange={(status) => status && updateStatus.mutate(status)}
        >
          <SelectTrigger aria-label="Change status" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">Payments</h2>
        {payments.isPending ? (
          <Skeleton className="h-16 w-full" />
        ) : payments.isError ? (
          <ErrorState
            title="Couldn't load payments"
            onRetry={() => payments.refetch()}
          />
        ) : payments.data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No payments yet.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {payments.data.map((payment) => (
              <li key={payment.id} className="flex justify-between p-3 text-sm">
                <span>
                  {payment.method === "card" ? "Card" : "Bank transfer"} ·{" "}
                  {formatDate(payment.createdAt)}
                </span>
                <span className="tabular-nums">
                  {formatMoney(payment.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
