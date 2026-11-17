"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Routes } from "@/lib/routes";
import { formatDate } from "@/shared/utils/formatDate";
import { EmptyState } from "@/ui/components/feedback/EmptyState";
import { ErrorState } from "@/ui/components/feedback/ErrorState";
import { Pagination } from "@/ui/components/navigation/Pagination";
import { Skeleton } from "@/ui/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table";
import { useOrders } from "../hooks/useOrders";
import { formatMoney } from "../utils/formatMoney";
import { parsePage } from "../utils/parsePage";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrdersScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Recent orders across all customers.
        </p>
      </div>

      <OrdersContent />
    </div>
  );
}

function OrdersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const page = parsePage(useSearchParams().get("page"));
  const { data, isPending, isError, refetch } = useOrders(page);

  if (isPending) return <Skeleton className="h-96 w-full" />;
  if (isError) {
    return (
      <ErrorState title="Couldn't load orders" onRetry={() => refetch()} />
    );
  }
  if (data.items.length === 0) return <EmptyState title="No orders yet" />;

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={Routes.order(order.id)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {order.number}
                  </Link>
                </TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(order.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        totalCount={data.totalCount}
        itemLabel={{ one: "order", other: "orders" }}
        onPageChange={(next) =>
          router.replace(next > 1 ? `${pathname}?page=${next}` : pathname, {
            scroll: false,
          })
        }
      />
    </>
  );
}
