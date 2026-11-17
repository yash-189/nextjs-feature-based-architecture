import { HttpResponse, http } from "msw";
import { currentUser } from "../auth";
import type { MockCustomer } from "../data/customers";
import { db } from "../db";
import { paginate } from "../paginate";
import { fail, ok } from "../respond";

type CustomerInput = Partial<
  Pick<MockCustomer, "name" | "email" | "company" | "status">
>;

const unauthorized = () => fail(401, "UNAUTHORIZED", "Sign in to continue.");
const notFound = () => fail(404, "NOT_FOUND", "Customer not found.");

function validate(input: CustomerInput, ignoreId?: string) {
  const errors: { field: string; message: string }[] = [];
  if (!input.name?.trim()) {
    errors.push({ field: "name", message: "Name is required." });
  }
  const email = input.email?.trim().toLowerCase();
  if (!email) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (db.customers.some((c) => c.email === email && c.id !== ignoreId)) {
    errors.push({
      field: "email",
      message: "A customer with this email already exists.",
    });
  }
  return errors;
}

export function customerHandlers(baseUrl: string) {
  return [
    http.get(`${baseUrl}/customers`, ({ request }) => {
      if (!currentUser(request)) return unauthorized();
      const params = new URL(request.url).searchParams;
      const search = params.get("search")?.trim().toLowerCase();
      const status = params.get("status");

      const matches = db.customers.filter(
        (c) =>
          (!search ||
            [c.name, c.email, c.company].some((v) =>
              v.toLowerCase().includes(search),
            )) &&
          (!status || c.status === status),
      );
      const { items, meta } = paginate(matches, params);
      return ok(items, { meta });
    }),

    http.get(`${baseUrl}/customers/:id`, ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      const customer = db.customers.find((c) => c.id === params.id);
      return customer ? ok(customer) : notFound();
    }),

    http.post(`${baseUrl}/customers`, async ({ request }) => {
      if (!currentUser(request)) return unauthorized();
      const input = (await request.json()) as CustomerInput;
      const errors = validate(input);
      if (errors.length) {
        return fail(
          422,
          "VALIDATION_FAILED",
          "Check the highlighted fields.",
          errors,
        );
      }
      const customer: MockCustomer = {
        id: `cus_${crypto.randomUUID().slice(0, 8)}`,
        name: input.name?.trim() ?? "",
        email: input.email?.trim().toLowerCase() ?? "",
        company: input.company?.trim() ?? "",
        status: input.status ?? "active",
        createdAt: new Date().toISOString(),
      };
      db.customers.unshift(customer);
      return ok(customer, { status: 201 });
    }),

    http.patch(`${baseUrl}/customers/:id`, async ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      const customer = db.customers.find((c) => c.id === params.id);
      if (!customer) return notFound();
      const input = (await request.json()) as CustomerInput;
      const errors = validate({ ...customer, ...input }, customer.id);
      if (errors.length) {
        return fail(
          422,
          "VALIDATION_FAILED",
          "Check the highlighted fields.",
          errors,
        );
      }
      Object.assign(customer, {
        ...input,
        ...(input.email && { email: input.email.trim().toLowerCase() }),
      });
      return ok(customer);
    }),

    http.delete(`${baseUrl}/customers/:id`, ({ request, params }) => {
      if (!currentUser(request)) return unauthorized();
      const index = db.customers.findIndex((c) => c.id === params.id);
      if (index === -1) return notFound();
      db.customers.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
