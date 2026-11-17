import { Endpoints, type Http } from "@/lib/http";
import { ORDERS_PAGE_SIZE } from "../constants";
import type { Order, OrderStatus } from "../types/order.types";

export const getOrders = (http: Http, page: number) =>
  http.getPage<Order>(Endpoints.orders.list, {
    params: { page, pageSize: ORDERS_PAGE_SIZE },
  });

export const getOrder = (http: Http, id: string) =>
  http.get<Order>(Endpoints.orders.one(id));

export const updateOrderStatus = (
  http: Http,
  id: string,
  status: OrderStatus,
) => http.patch<Order>(Endpoints.orders.one(id), { status });
