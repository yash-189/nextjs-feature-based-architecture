import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { ApiError, toApiError } from "./errors";

function axiosError(status: number, data?: unknown) {
  const response = {
    status,
    data,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosResponse;
  return new AxiosError("failed", undefined, undefined, undefined, response);
}

describe("toApiError", () => {
  it("returns an ApiError unchanged", () => {
    const error = new ApiError({ status: 400 });
    expect(toApiError(error)).toBe(error);
  });

  it("reads the code, message and field errors from the body", () => {
    const error = toApiError(
      axiosError(422, {
        errorCode: "VALIDATION",
        message: "Invalid input",
        errors: [{ field: "email", message: "Taken" }],
      }),
    );
    expect(error).toMatchObject({
      status: 422,
      code: "VALIDATION",
      message: "Invalid input",
      fieldErrors: [{ field: "email", message: "Taken" }],
    });
  });

  it("treats a missing response as a network error", () => {
    const error = toApiError(new AxiosError("Network Error"));
    expect(error.status).toBe(0);
    expect(error.message).toMatch(/couldn't reach the server/i);
  });

  it("treats an empty 502 from the proxy as a network error", () => {
    const error = toApiError(axiosError(502));
    expect(error.message).toMatch(/couldn't reach the server/i);
  });

  it("falls back to a generic message", () => {
    expect(toApiError(new Error("boom")).message).toMatch(/went wrong/i);
  });
});
