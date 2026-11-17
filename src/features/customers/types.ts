import type { CUSTOMER_STATUS_FILTERS, CUSTOMER_STATUSES } from "./constants";

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];
export type CustomerStatusFilter = (typeof CUSTOMER_STATUS_FILTERS)[number];

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface CustomerFilters {
  search: string;
  status: CustomerStatusFilter;
  page: number;
}
