<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

A feature-based Next.js app that talks to a separate backend API. If this
file and the code disagree, trust the code and update this file.

## Structure

```
src/
  app/          routes only, no logic
  features/<x>/ components/, hooks/, utils/, api.ts, queries.ts, schemas.ts,
                types.ts, constants.ts, index.ts
  ui/           primitives/ (shadcn) and components/{feedback,layout,navigation,theme}
  shared/       hooks/ and utils/ used by 2+ features, no business logic
  lib/          http/, session, env, query, routes, cookies, site
  providers/    React Query, theme, toasts (only app/ imports this)
  theme/        design tokens
  mocks/        MSW mock backend: handlers/, data/, db.ts (dev and tests)
  test/         test setup and renderWithProviders
  proxy.ts      redirects signed-out users (Next 16's middleware)
```

`features/customers` (small) and `features/orders` (grown) are samples.
Copy `customers` to start a feature, and delete both when starting a real
project. See `docs/architecture.md` for the reasoning behind these rules.

A feature starts with flat files. A file becomes a folder (`api/`, `types/`,
`schemas/`, `queries/`) once it holds two or more resources or passes about
300 lines; files inside use a suffix, like `orders.api.ts`. A feature that
keeps growing is split into two features rather than nested deeper.

## Imports

```
app        → providers, features, ui, shared, lib, theme, mocks
providers  → lib, theme
features   → ui, shared, lib   (other features only through their index.ts)
ui         → shared, lib, theme
shared     → lib, theme
lib        → theme
```

Biome checks the ones that matter most: no importing another feature's
internals, ui/lib/shared never import from features, and `sonner` is only
imported by `lib/toast.ts`. Inside a feature,
import files directly.

## Mock backend

With `API_MOCKING=enabled`, `app/api/mock` serves the MSW handlers over real
HTTP and `API_URL` points at it, so the proxy, cookies and refresh flow all
run for real. Nothing patches `fetch`, so it behaves the same in dev, in a
production build and in a deployment. The app has
no mock-specific code paths: turn it off and point `API_URL` at a real
backend. Features never import `mocks/`; add a handler there for each new
endpoint, mirroring the real API's envelope. Only `app/` imports it. The data is in memory and resets
when the server restarts. Tests reuse the same handlers with `setupServer`.

## Where things live

| What | Where |
|---|---|
| Response types | `features/<x>/types.ts` |
| Backend calls | `features/<x>/api.ts` |
| Query keys and queries (`queryOptions`) | `features/<x>/queries.ts` |
| Form validation | `features/<x>/schemas.ts` |
| Backend paths | `lib/http/endpoints.ts` |
| Page paths, protected pages | `lib/routes.ts` |
| HTTP setup (base URL, token, errors) | `lib/http/` |
| Session cookies | `lib/session.ts`, names in `lib/cookies.ts` |
| Mock endpoints and demo data | `mocks/handlers/`, `mocks/data/` |
| Env variables | `lib/env.ts` (nothing else reads `process.env`) |
| Toasts | `lib/toast.ts` |
| App name | `lib/site.ts` |
| Colors and type | `theme/` |

No hardcoded paths, env reads or colors anywhere else.

## Data and auth

- Tokens live in httpOnly cookies. The browser never sees them.
- There are two Axios instances. `serverHttp` is server only and calls the
  backend directly. `clientHttp` runs in the browser and goes through
  `/api/backend`, which adds the token.
- Never put the token on an instance's defaults. The server instance is
  shared by every request.
- Feature `api.ts` functions take the instance as an argument, so the same
  function works in a server component and in a hook.
- Use `http.get<T>` for data and `http.getPage<T>` for paginated lists. The
  response envelope is unwrapped in `lib/http`; features never see it.
- Signed in means the refresh cookie exists. An expired access token gets
  refreshed on its first 401.
- On a 401, `clientHttp` refreshes once and retries. Requests that fail at
  the same time wait for that same refresh. A revoked session or a failed
  refresh goes to login.
- Check `ApiError.code`, never the message text.
- Reads and writes go through TanStack Query hooks. Server pages prefetch.
- Each query is defined once in `queries.ts` with `queryOptions`, taking the
  HTTP instance. Hooks call it with `clientHttp`; server pages prefetch it with
  `serverHttp`. Keys live beside it in `<x>Keys` for invalidation.
- Server actions are only for login and logout, because they set cookies.
- Failed writes show a toast. Field errors go on the form instead.
- `types.ts` is what the backend returns. Only add a separate UI type if the
  UI really needs a different shape.
- A form schema describes what the user can submit. It doesn't have to match
  the API, and the backend is the final check.

## State

- Server data: TanStack Query. Don't copy it into a store.
- Filters, search, page number: the URL.
- Local UI: `useState`. Theme: `useTheme` from next-themes.
- Global client state: Zustand, added when it's actually needed, as
  `src/store/<name>.store.ts`. No Redux.
- Context only for state inside one feature, as `features/<x>/context.tsx`.

## Conventions

- Features use `components/` and `hooks/` folders, one hook per file.
- A component moves to `ui/components` only when a second feature needs it.
- Every screen that loads data handles loading, error, empty and content.
- Add `import "server-only"` to anything that reads cookies or secrets.
- Named exports, except Next's route files.
- Tests go next to the file they test. Render components that use queries
  with `renderWithProviders` from `src/test/render.tsx`.

## Principles

- **Single source of truth.** Each rule lives in one function, used
  everywhere. Never write the same logic twice; two copies drift apart.
- **Data stays data.** Never write UI text into data (e.g. `name: "Deleted
  customer"`). Store the fact (`deletedAt`) and let the UI render the label.
- **One job per piece.** Components render. Formatting, filtering and
  parsing live in pure functions (`filters.ts`, `utils/`), tested once.
- **Keep it readable.** No `let x = ""` followed by if/else reassignment;
  use a small function with early returns or a lookup object. At most one
  level of ternary. Screens with loading / error / empty / content states
  use a component with early returns in that order. Biome enforces this
  (`noNestedTernary`, `noExcessiveCognitiveComplexity`) and sorts Tailwind
  classes, including inside `cn()`.
- **Strings.** User-facing text used in 2+ places, or that carries meaning
  (errors, statuses), goes in the feature's `constants.ts`. One-off labels
  can stay inline in JSX.
- **Vendor boundaries.** Code depends on our interface, not the library's:
  - backend → `features/<x>/api.ts`
  - toasts → `lib/toast.ts` (typed `success` / `error` only)

  Swapping a library changes one file. Biome blocks importing `sonner`
  directly. Don't wrap a library just to pass calls through; a wrapper
  should narrow the API or add behaviour.
- **Browser APIs** (clipboard, storage) go behind a small hook, not inline
  in components. It lives in the feature until a second feature needs it,
  then moves to `shared/hooks`.
- **Tailwind:** use scale classes (`min-h-4.5`, not `min-h-[1.125rem]`), no
  redundant classes, no hardcoded colors.

## Keep it simple

Build what the current problem needs. Wait for a second use before
extracting anything. No service or repository layers on top of `api.ts`.
Delete experiments once you've picked one. Comments explain why, not what.

## Checks

```
npm run check   typecheck and lint
npm test        unit and component tests
```
