import { useQuery } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { orderQueries } from "../queries/orders.queries";

export function useOrders(page: number) {
  return useQuery(orderQueries.list(clientHttp, page));
}
