import { Endpoints, type Http } from "@/lib/http";
import { CUSTOMERS_PAGE_SIZE } from "./constants";
import type { CustomerFormValues } from "./schemas";
import type { Customer, CustomerFilters } from "./types";

export const getCustomers = (http: Http, filters: CustomerFilters) =>
  http.getPage<Customer>(Endpoints.customers.list, {
    params: {
      search: filters.search || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      page: filters.page,
      pageSize: CUSTOMERS_PAGE_SIZE,
    },
  });

export const createCustomer = (http: Http, values: CustomerFormValues) =>
  http.post<Customer>(Endpoints.customers.list, values);

export const updateCustomer = (
  http: Http,
  id: string,
  values: CustomerFormValues,
) => http.patch<Customer>(Endpoints.customers.one(id), values);

export const deleteCustomer = (http: Http, id: string) =>
  http.delete(Endpoints.customers.one(id));
