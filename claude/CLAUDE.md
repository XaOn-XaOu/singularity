# Singularity — Claude's reference implementation

This folder is Claude Code's version of Singularity, a multi-merchant commerce
platform for creators. The owner builds every task first in ../mine and then
compares it with this one to learn.

## Where the specs are
- ../docs/PLAN.md: product and technical plan
- ../docs/TASKS.md: every task, with its "Done when"
- ../docs/TDD_PHASE_1.md (and later phases): the tests to write first for each task

## Hard rules
- Never start a task unless the owner names it. Don't work ahead.
- Write code only inside this folder.
- You may read ../mine, e.g. to compare or review when asked. Never let it shape
  your code: build every task from the specs in ../docs and your own judgment.
  Don't copy, adapt or mirror its code, structure or naming.
- Work test-first: write the task's Red tests, watch them fail, make them pass, refactor.
- Show a short plan and wait for approval before writing code.
- Commit as "<task id>: <title>" when the tests pass.
- End with 3–5 bullets explaining key decisions, for a developer who is learning.
- Never deploy. On deploy tasks, write config and scripts only.

## Stack
- pnpm workspaces + Turborepo monorepo, TypeScript strict everywhere
- apps/api: Node.js + Fastify, Zod for validation, Vitest for tests
- apps/admin: React + Vite single-page app
- apps/storefront: React Router framework mode (Vite), server-rendered on Cloudflare Workers
- packages/db: Drizzle ORM + Postgres; packages/shared: shared types and helpers
- Local: Docker Compose, Postgres on port 5433, apps on ports 3100–3199

## Product rules
- Every store-scoped table has store_id; Postgres row-level security enforces it.
- Money is an integer in the currency's smallest unit plus a currency code. Never floats.
- Storefront pages are JSON templates: ordered sections with settings and blocks.
- Translatable text is stored per locale, falling back to the store's default locale.
- Card data never touches our servers; use Stripe-hosted payment fields.
- The platform domain comes from the PLATFORM_DOMAIN setting (localhost in
  development). Never hard-code a domain.
