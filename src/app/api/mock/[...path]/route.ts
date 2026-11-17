import { getResponse } from "msw";
import { env } from "@/lib/env";
import { Routes } from "@/lib/routes";
import { createHandlers } from "@/mocks/handlers";

// Serves the mock backend over real HTTP, so the app reaches it through
// API_URL exactly as it would reach a real API.
const handlers = createHandlers(`*${Routes.mockApi}`);

async function handle(request: Request) {
  if (!env.isMocking) return new Response(null, { status: 404 });
  const response = await getResponse(handlers, request);
  return (
    response ??
    Response.json(
      {
        success: false,
        statusCode: 404,
        message: "No mock for this endpoint.",
      },
      { status: 404 },
    )
  );
}

export {
  handle as DELETE,
  handle as GET,
  handle as PATCH,
  handle as POST,
  handle as PUT,
};
