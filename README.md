# Feature-Based Next.js Architecture

A Next.js starter for apps that talk to a separate backend API, organised by
feature with enforced module boundaries.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui ·
TanStack Query · React Hook Form + Zod · Axios · Biome · Vitest · Testing Library

## Getting started

```bash
cp .env.example .env.local   # set API_URL to your backend
npm install
npm run dev
```

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | production build |
| `npm run check` | typecheck and lint |
| `npm test` | run unit and component tests |
| `npm run test:watch` | run tests in watch mode |
| `npm run test:coverage` | run tests with a coverage report |
| `npm run format` | format and fix lint issues |

## License

MIT
