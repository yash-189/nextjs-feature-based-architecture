import { http } from "msw";
import { currentUser } from "../auth";
import type { MockOrder, MockOrderStatus } from "../data/orders";
import { db } from "../db";
import { paginate } from "../paginate";
import { fail, ok } from "../respond";

const STATUSES: MockOrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

const unauthorized = () => fail(401, "UNAUTHORIZED", "Sign in to continue.");
const notFound = () => fail(404, "NOT_FOUND", "Order not found.");

// The real API embeds a customer summary in each order.
function withCustomer(order: MockOrder) {
  const customer = db.customers.find((c) => c.id === order.customerId);
  const { customerId, ...rest } = order;
  return {
    ...rest,
    customer: customer
      ? { id: customer.id, name: customer.name, email: customer.email }
      : { id: customerId, name: "Deleted customer", email: "" },
  };
}

export function orderHandlers(baseUrl: string) {
  return [
    http.get(`${baseUrl}/orders`, ({ request }) => {
      if (!currentUser(request)) return unauthorized();
      const params = new URL(request.url).searchParams;
      const { items, meta } = paginate(db.orders, params);
      return ok(items.map(withCustomer), { meta });
    }),

    http.get(`${baseUrl}/orders/:id`, ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      const order = db.orders.find((o) => o.id === params.id);
      return order ? ok(withCustomer(order)) : notFound();
    }),

    http.patch(`${baseUrl}/orders/:id`, async ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      const order = db.orders.find((o) => o.id === params.id);
      if (!order) return notFound();
      const { status } = (await request.json()) as { status?: MockOrderStatus };
      if (!status || !STATUSES.includes(status)) {
        return fail(422, "VALIDATION_FAILED", "Choose a valid status.", [
          { field: "status", message: "Choose a valid status." },
        ]);
      }
      order.status = status;
      return ok(withCustomer(order));
    }),

    http.get(`${baseUrl}/orders/:id/payments`, ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      if (!db.orders.some((o) => o.id === params.id)) return notFound();
      return ok(db.payments.filter((p) => p.orderId === params.id));
    }),
  ];
}
