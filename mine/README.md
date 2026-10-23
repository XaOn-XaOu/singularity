# Singularity

A multi-merchant commerce platform for creators. Each creator runs their own
store on its own subdomain and sells digital products and merch to fans
worldwide, in the fans' own language and currency.

**Status:** early development. The monorepo skeleton is in place; the apps are
still empty placeholders.

## What's inside

| Package                   | Path              | Purpose                                                     |
| ------------------------- | ----------------- | ----------------------------------------------------------- |
| `@singularity/api`        | `apps/api`        | Backend API (Node.js + Fastify)                             |
| `@singularity/admin`      | `apps/admin`      | Dashboard where creators manage their stores (React + Vite) |
| `@singularity/storefront` | `apps/storefront` | The stores shoppers visit, rendered on Cloudflare Workers   |
| `@singularity/db`         | `packages/db`     | Database schema and connection (Postgres + Drizzle ORM)     |
| `@singularity/shared`     | `packages/shared` | Types and helpers shared by the apps                        |

Everything is strict TypeScript, managed with pnpm workspaces and Turborepo.

## Requirements

- Node.js 26 or newer
- pnpm 12 (the exact version is pinned in `package.json`)

## Getting started

```sh
pnpm install
pnpm build
```

## Commands

Run these from the repository root. Turborepo runs each one in every package and
caches the results.

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm build`     | Compiles every package to its `dist/` folder                    |
| `pnpm typecheck` | Type-checks every package, tests included                       |
| `pnpm lint`      | Runs ESLint in every package, then checks formatting (Prettier) |
| `pnpm test`      | Runs the tests (Vitest)                                         |
| `pnpm format`    | Formats the whole repository with Prettier                      |
