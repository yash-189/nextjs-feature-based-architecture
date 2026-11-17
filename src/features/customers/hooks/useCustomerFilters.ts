import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseCustomerFilters, toSearchParams } from "../filters";
import type { CustomerFilters } from "../types";

export function useCustomerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseCustomerFilters(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (changes: Partial<CustomerFilters>) => {
      // A new search or status starts again from the first page.
      const next = { ...filters, page: 1, ...changes };
      const query = toSearchParams(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [filters, pathname, router],
  );

  return { filters, setFilters };
}
