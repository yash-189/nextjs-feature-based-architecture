import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { Http } from "@/lib/http";
import { getCustomers } from "./api";
import type { CustomerFilters } from "./types";

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: CustomerFilters) =>
    [...customerKeys.lists(), filters] as const,
};

export const customerQueries = {
  list: (http: Http, filters: CustomerFilters) =>
    queryOptions({
      queryKey: customerKeys.list(filters),
      queryFn: () => getCustomers(http, filters),
      // Keeps the current page on screen while the next one loads.
      placeholderData: keepPreviousData,
    }),
};
