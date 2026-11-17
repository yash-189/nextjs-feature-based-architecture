import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import {
  CustomersScreen,
  customerQueries,
  parseCustomerFilters,
} from "@/features/customers";
import { serverHttp } from "@/lib/http/server";
import { getQueryClient } from "@/lib/query";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: PageProps<"/customers">) {
  const filters = parseCustomerFilters(await searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(customerQueries.list(serverHttp, filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CustomersScreen />
    </HydrationBoundary>
  );
}
