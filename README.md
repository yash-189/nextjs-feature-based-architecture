# Feature-Based Next.js Architecture

[![CI](https://github.com/yash-189/nextjs-feature-based-architecture/actions/workflows/ci.yml/badge.svg)](https://github.com/yash-189/nextjs-feature-based-architecture/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%3E%3D22-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

A Next.js starter for apps that talk to a separate backend API. Code is
organised by feature, module boundaries are enforced by the linter, and it
runs out of the box against a built-in mock backend.

## Highlights

- **Feature-based structure** with a public `index.ts` per feature and lint
  rules that stop features reaching into each other.
- **A growth rule**: features start with flat files and grow folders only when
  they need them. Two sample features show both stages.
- **Secure auth** with tokens in httpOnly cookies, a backend proxy, and
  refresh-once on 401 for parallel requests.
- **Typed data layer**: one `queryOptions` per query, reused by server
  prefetch and client hooks.
- **Mock backend** (MSW) served over real HTTP, so the whole flow runs
  without a backend and tests reuse the same handlers.
- **Tooling**: Biome, Vitest, Testing Library, husky + lint-staged, GitHub
  Actions and Dependabot.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) ·
TanStack Query · React Hook Form + Zod · Axios · MSW · Vitest · Biome

## Getting started

Requires Node 22 or newer (`nvm use` picks the version in `.nvmrc`).

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 and sign in with **demo@example.com / password**.

The defaults run the mock backend. To use a real API, set `API_URL` and
`API_MOCKING=disabled` in `.env.local`. If the dev server runs on another
port, update `API_URL` to match.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | production build |
| `npm run start` | serve the production build |
| `npm run check` | typecheck and lint |
| `npm run format` | format and fix lint issues |
| `npm test` | run unit and component tests |
| `npm run test:watch` | run tests in watch mode |
| `npm run test:coverage` | run tests with a coverage report |

## Project structure

```
src/
  app/                      routes only: pages, layouts, route handlers
    (marketing)/              public landing page
    (auth)/login/             sign-in page
    (app)/                    signed-in area: layout, error.tsx, loading.tsx
      customers/  orders/  orders/[id]/  dashboard/
    api/backend/[...path]/    BFF proxy: adds the token from the cookie
    api/auth/refresh/         refreshes the session cookie
    api/mock/[...path]/       mock backend (when API_MOCKING=enabled)
    not-found.tsx  global-error.tsx
  features/
    auth/                     login/logout server actions, LoginForm
    customers/                small feature, flat files
      components/  hooks/
      api.ts  queries.ts  schemas.ts  types.ts  filters.ts  constants.ts
      index.ts                public API, the only file others import
    orders/                   grown feature, files became folders
      api/       orders.api.ts  payments.api.ts
      queries/   keys.ts  orders.queries.ts  payments.queries.ts
      types/     order.types.ts  payment.types.ts
      components/  hooks/  utils/  constants.ts  index.ts
  ui/
    primitives/               shadcn (Base UI): button, dialog, select, table…
    components/               shared, feature-agnostic components
      feedback/                 EmptyState, ErrorState
      navigation/               Pagination
      layout/                   NavLink
      theme/                    ThemeToggle
  shared/
    hooks/                    useDebouncedValue
    utils/                    formatDate
  lib/
    http/                     axios clients (server + browser), errors,
                              endpoints, envelope unwrapping, params
    session.ts  cookies.ts    httpOnly token cookies
    env.ts                    zod-validated environment
    routes.ts  site.ts  query.ts  utils.ts
  mocks/                      MSW handlers, demo data, in-memory db
  providers/                  React Query, theme and toasts
  theme/                      design tokens (globals.css)
  test/                       Vitest setup and renderWithProviders
  proxy.ts                    redirects signed-out users to /login
```

### Import rules

| Layer | Can import |
|---|---|
| `app` | everything |
| `features` | `ui`, `shared`, `lib`, and other features **only via their `index.ts`** |
| `ui` | `shared`, `lib`, `theme` |
| `shared` | `lib`, `theme` |
| `lib` | `theme` |

Biome (`noRestrictedImports`) fails the build when a rule is broken, so the
boundaries hold as the team grows.

See [docs/architecture.md](docs/architecture.md) for the layers, the
request and auth flow, how a feature grows, and the trade-offs behind each
decision.

## What's included

**Shared UI** (`src/ui/components`)

| Component | Use |
|---|---|
| `EmptyState` | no-results / first-use screens with an optional action |
| `ErrorState` | failed queries, with a retry button |
| `Pagination` | generic page controls driven by the URL (`itemLabel` prop) |
| `NavLink` | nav link with active state |
| `ThemeToggle` | switches light and dark |

A component moves here only when a second feature needs it.

**Data patterns** (see `customers` and `orders`)

- Server prefetch + `HydrationBoundary`, same `queryOptions` on the client
- Filters, search and page in the URL, debounced search
- Create / edit / delete dialogs with React Hook Form + Zod, field errors
  from the API mapped onto the form
- Optimistic status update with rollback (`useUpdateOrderStatus`)
- `keepPreviousData` paging, skeletons, empty and error states on every screen

**HTTP and auth** (`src/lib/http`, `src/lib/session.ts`)

- `serverHttp` for server code, `clientHttp` for the browser through the proxy
- Tokens only in httpOnly cookies; refresh once on 401, shared by parallel
  requests; revoked sessions go straight to login
- Typed `ApiError` with status, code and field errors
- Proxy forwards an allow-list of headers, times out after 15s, and blocks
  token endpoints from the browser

**App shell**

- `error.tsx`, `loading.tsx`, `not-found.tsx`, `global-error.tsx`
- Security headers and `poweredByHeader: false` in `next.config.ts`
- Route guard in `proxy.ts`

**Quality**

- Vitest + Testing Library tests beside the code (HTTP client refresh,
  mock handlers, parsers, components)
- Pre-commit Biome via husky + lint-staged, Node pinned in `.nvmrc`
- CI on every PR: lint, typecheck, test, build; Dependabot updates

## Adding a feature

1. Create `src/features/<name>/` with `components/`, `hooks/`, `api.ts`,
   `queries.ts`, `types.ts` and `index.ts`. `customers` is the reference.
2. Add the backend paths to `src/lib/http/endpoints.ts` and the page path to
   `src/lib/routes.ts`.
3. Add a route in `src/app/` that prefetches the query and renders the
   feature's screen.
4. While mocking, add a handler in `src/mocks/handlers/`.
5. Export only what other code needs from `index.ts`.

When you start a real project, delete the `customers` and `orders` samples
along with their mocks, routes and endpoints.

## Deploying

The app deploys to any Node host. On Vercel, set these environment
variables:

| Variable | Value |
|---|---|
| `API_URL` | your backend URL, or `https://<your-domain>/api/mock` for a demo |
| `API_MOCKING` | `disabled` with a real backend, `enabled` for a demo |

## License

[MIT](LICENSE)
