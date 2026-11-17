import { useQuery } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { paymentQueries } from "../queries/payments.queries";

export function useOrderPayments(orderId: string) {
  return useQuery(paymentQueries.forOrder(clientHttp, orderId));
}
