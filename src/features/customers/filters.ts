import { CUSTOMER_STATUS_FILTERS } from "./constants";
import type { CustomerFilters, CustomerStatusFilter } from "./types";

type SearchParamsLike =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function read(source: SearchParamsLike, key: string) {
  const value =
    source instanceof URLSearchParams ? source.get(key) : source[key];
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

// Shared by the server page and the client hook, so both build the same
// query key and the prefetched data is reused.
export function parseCustomerFilters(
  source: SearchParamsLike,
): CustomerFilters {
  const status = read(source, "status");
  const page = Number(read(source, "page"));
  return {
    search: read(source, "search")?.trim() ?? "",
    status: CUSTOMER_STATUS_FILTERS.includes(status as CustomerStatusFilter)
      ? (status as CustomerStatusFilter)
      : "all",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

export function toSearchParams(filters: CustomerFilters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params;
}
