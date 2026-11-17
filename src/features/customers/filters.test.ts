import { describe, expect, it } from "vitest";
import { parseCustomerFilters, toSearchParams } from "./filters";

describe("customer filters", () => {
  it("falls back to defaults for missing or invalid values", () => {
    expect(parseCustomerFilters({ status: "archived", page: "-2" })).toEqual({
      search: "",
      status: "all",
      page: 1,
    });
  });

  it("round-trips through the URL", () => {
    const filters = { search: "acme", status: "inactive", page: 3 } as const;
    expect(parseCustomerFilters(toSearchParams(filters))).toEqual(filters);
  });
});
