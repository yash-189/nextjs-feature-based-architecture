import { delay, HttpResponse } from "msw";
import { MOCK_LATENCY_MS } from "./constants";

interface PageMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface FieldError {
  field: string;
  message: string;
}

// Mirrors the envelope lib/http expects from a real backend.
export async function ok<T>(
  data: T,
  init?: { status?: number; meta?: PageMeta },
) {
  await delay(MOCK_LATENCY_MS);
  return HttpResponse.json(
    { success: true, data, ...(init?.meta && { meta: init.meta }) },
    { status: init?.status ?? 200 },
  );
}

export async function fail(
  status: number,
  errorCode: string,
  message: string,
  errors?: FieldError[],
) {
  await delay(MOCK_LATENCY_MS);
  return HttpResponse.json(
    { success: false, statusCode: status, errorCode, message, errors },
    { status },
  );
}
