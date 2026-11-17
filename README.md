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
  app/          routes only: pages, layouts, route handlers
  features/     one folder per business feature
    auth/         sign-in and sign-out
    customers/    sample: a small feature with flat files
    orders/       sample: the same rules after the feature grew
  ui/           primitives/ (shadcn) and shared components/
  shared/       hooks and utils used by two or more features
  lib/          HTTP client, session, env, routes, query client
  mocks/        mock backend: handlers, demo data, in-memory db
  providers/    React Query, theme and toasts
  theme/        design tokens
  test/         test setup and helpers
```

Imports only point one way:

```
app → features → ui / shared → lib
```

See [docs/architecture.md](docs/architecture.md) for the layers, the
request and auth flow, how a feature grows, and the trade-offs behind each
decision.

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
