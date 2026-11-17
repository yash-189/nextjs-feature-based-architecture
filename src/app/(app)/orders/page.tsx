import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { OrdersScreen, orderQueries, parsePage } from "@/features/orders";
import { serverHttp } from "@/lib/http/server";
import { getQueryClient } from "@/lib/query";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({
  searchParams,
}: PageProps<"/orders">) {
  const page = parsePage((await searchParams).page);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(orderQueries.list(serverHttp, page));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersScreen />
    </HydrationBoundary>
  );
}
