import { queryOptions } from "@tanstack/react-query";
import type { Http } from "@/lib/http";
import { getOrderPayments } from "../api/payments.api";
import { orderKeys } from "./keys";

export const paymentQueries = {
  forOrder: (http: Http, orderId: string) =>
    queryOptions({
      queryKey: orderKeys.payments(orderId),
      queryFn: () => getOrderPayments(http, orderId),
    }),
};
