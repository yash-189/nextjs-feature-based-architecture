import { describe, expect, it } from "vitest";
import { serializeParams } from "./params";

describe("serializeParams", () => {
  it("repeats the key for array values", () => {
    expect(serializeParams({ tag: ["a", "b"] })).toBe("tag=a&tag=b");
  });

  it("skips null and undefined", () => {
    expect(serializeParams({ q: "x", page: undefined, sort: null })).toBe(
      "q=x",
    );
  });

  it("stringifies numbers and booleans", () => {
    expect(serializeParams({ page: 2, archived: false })).toBe(
      "page=2&archived=false",
    );
  });
});
