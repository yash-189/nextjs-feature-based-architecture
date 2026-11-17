import { useQuery } from "@tanstack/react-query";
import { clientHttp } from "@/lib/http";
import { customerQueries } from "../queries";
import type { CustomerFilters } from "../types";

export function useCustomers(filters: CustomerFilters) {
  return useQuery(customerQueries.list(clientHttp, filters));
}
