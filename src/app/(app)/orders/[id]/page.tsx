import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import {
  OrderDetailScreen,
  orderQueries,
  paymentQueries,
} from "@/features/orders";
import { serverHttp } from "@/lib/http/server";
import { getQueryClient } from "@/lib/query";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(orderQueries.detail(serverHttp, id)),
    queryClient.prefetchQuery(paymentQueries.forOrder(serverHttp, id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDetailScreen id={id} />
    </HydrationBoundary>
  );
}
