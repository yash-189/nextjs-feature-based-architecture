import { useQuery } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { orderQueries } from "../queries/orders.queries";

export function useOrder(id: string) {
  return useQuery(orderQueries.detail(clientHttp, id));
}
