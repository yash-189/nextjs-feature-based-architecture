import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { Http } from "@/lib/http";
import { getOrder, getOrders } from "../api/orders.api";
import { orderKeys } from "./keys";

export const orderQueries = {
  list: (http: Http, page: number) =>
    queryOptions({
      queryKey: orderKeys.list(page),
      queryFn: () => getOrders(http, page),
      placeholderData: keepPreviousData,
    }),
  detail: (http: Http, id: string) =>
    queryOptions({
      queryKey: orderKeys.detail(id),
      queryFn: () => getOrder(http, id),
    }),
};
