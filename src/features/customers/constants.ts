export const CUSTOMER_STATUSES = ["active", "inactive"] as const;
export const CUSTOMER_STATUS_FILTERS = ["all", ...CUSTOMER_STATUSES] as const;
export const CUSTOMERS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 300;
