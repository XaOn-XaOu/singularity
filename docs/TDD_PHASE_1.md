# TDD · Phase 1

Every Phase 1 task as red → green → refactor: the failing tests you write first, what makes them pass, and what to clean up. Tick the boxes as you go.

## How to work test-first

Write one test, watch it fail, make it pass with the least code, clean up, commit. When a task's Red list is done, its "Done when" in TASKS.md is met.

1. **Red:** write one test from the list and run it. It must fail for the right reason, such as a missing route rather than a typo.
2. **Green:** write the simplest code that makes it pass.
3. **Refactor:** tidy up while every test stays green, then commit.

| Level | Tools | Used for |
| --- | --- | --- |
| Unit | Vitest | Pure functions: handles, money, config |
| API | Vitest + Fastify `inject()` + a real test Postgres | Routes, auth, row-level security |
| UI | Vitest + React Testing Library + MSW to mock the API | Admin screens |
| Worker | Vitest with Cloudflare's Workers test pool, or a fake KV | Storefront loaders and caching |
| Smoke | A small script that calls deployed URLs | Deploys |

**Test database:** a separate database, `singularity_test`. Migrate it once before the test run, and empty the tables between test files.

## Tasks 1.1–1.4 · Project and database

### 1.1 Monorepo skeleton

**Red**

- [ ] At the repo root, run `pnpm build`, `pnpm lint`, `pnpm typecheck` and `pnpm test`. All four fail, because nothing exists yet.
- [ ] In `packages/shared`, write `index.test.ts`: `PACKAGE_NAME` imported from `./index` equals `"@singularity/shared"`.

**Green**

- [ ] Add `pnpm-workspace.yaml`, `turbo.json`, a strict `tsconfig.base.json`, and ESLint and Prettier configs.
- [ ] Create `apps/api`, `apps/admin`, `apps/storefront`, `packages/db` and `packages/shared`, each with its own `package.json`, `tsconfig.json` and the four scripts.
- [ ] Export `PACKAGE_NAME`. All four root commands now pass.

**Refactor**

- [ ] Prove strict mode works: add `const f = (a) => a` to `shared`, check that `pnpm typecheck` fails, then delete it.
- [ ] Commit `1.1: monorepo skeleton`.

### 1.2 Local services

**Red**

- [ ] In `packages/db`, write `services.test.ts`. It connects to `DATABASE_URL` and runs `select 1`, then requests the Mailpit web page. Both fail, because nothing is running.

**Green**

- [ ] Write `docker-compose.yml` with Postgres on port 5432 and Mailpit, plus `.env.example` with `DATABASE_URL` and the SMTP settings.
- [ ] Create a second database, `singularity_test`, for tests.

**Refactor**

- [ ] Add container health checks and `pnpm services:up` and `pnpm services:down` scripts.

### 1.3 API hello world

**Red**

- [ ] `health.test.ts`: `app.inject({ method: "GET", url: "/health" })` returns 200 and `{ "ok": true }`.
- [ ] `config.test.ts`: loading config without `DATABASE_URL` throws an error that names the missing variable.

**Green**

- [ ] Write a `buildApp()` function that creates the Fastify app without listening, a Zod schema for environment variables, and structured logging.

**Refactor**

- [ ] Keep `server.ts`, which listens on a port, separate from `app.ts`, which builds the app. That way tests never open a port.

### 1.4 Database setup

**Red**

- [ ] `stores.test.ts`, against the test database: insert a store and read it back.
- [ ] Inserting a second store with the same `handle` throws.

**Green**

- [ ] Drizzle schema for `stores`: UUID id, name, unique handle, default locale, default currency, created time.
- [ ] Add `db:generate` and `db:migrate` scripts. Tests migrate the test database before they run.

**Refactor**

- [ ] Add a `resetDb()` test helper that empties tables between test files.

## Tasks 1.5–1.8 · Accounts and stores

### 1.5 Users and staff schema

**Red**

- [ ] Emails are unique regardless of case: `A@x.com` and `a@x.com` clash.
- [ ] The same user can't be added to the same store twice.
- [ ] A role other than owner, admin or staff is rejected.
- [ ] Running the seed creates exactly one user who owns one store.

**Green**

- [ ] Add tables `users`, `sessions` and `staff_members`, a role enum, a lowercase-email rule and the seed script.

**Refactor**

- [ ] Add shared test factories such as `createUser()` and `createStore()`.

### 1.6 Sign-up and log-in API

**Red** (every test goes through `app.inject`)

- [ ] `POST /auth/signup` returns 201 and sets an httpOnly session cookie. The stored password is an argon2 hash, not the password itself.
- [ ] Signing up with an existing email returns 409.
- [ ] A password shorter than 12 characters returns 400.
- [ ] `POST /auth/login` with a wrong password returns 401, with the same message as for an unknown email.
- [ ] `GET /me` returns the user when the cookie is sent, and 401 when it isn't.
- [ ] After `POST /auth/logout`, the old cookie gets 401.

**Green**

- [ ] Add the auth routes, argon2 hashing, session rows with an expiry, and cookie handling.

**Refactor**

- [ ] Extract a `requireUser` hook that other routes reuse.

### 1.7 Row-level security

**Red**

- [ ] Give stores A and B their own staff rows. A query inside `withStore(A)` returns only A's rows.
- [ ] A query with no current store returns no rows, never all of them.
- [ ] Run these tests as the app's database role, not the role that owns the tables. Table owners skip RLS unless it's forced, so this proves the policy really applies.

**Green**

- [ ] Write a migration that enables and forces RLS on store tables, with policies that compare `store_id` to the current store setting.
- [ ] Write a `withStore(storeId, fn)` helper that sets the store for one transaction only.

**Refactor**

- [ ] Add a Fastify hook that wraps store-scoped routes in `withStore` automatically.

### 1.8 Create-store API

**Red**

- [ ] A logged-in `POST /stores` returns 201, and the caller becomes the owner.
- [ ] Table-driven handle tests: 3–30 characters; lowercase letters, digits and hyphens only; no hyphen at either end.
- [ ] Reserved handles such as `admin`, `api` and `www` return 400.
- [ ] A duplicate handle returns 409. A request with no session returns 401.
- [ ] `GET /stores` lists only the stores the caller belongs to.

**Green**

- [ ] Add the route, a handle validator and a list of reserved words.

**Refactor**

- [ ] Move the handle rules into `shared`, so the admin app and storefront can reuse them.

## Tasks 1.9–1.10 · Admin app

### 1.9 Admin app skeleton

**Red** (Vitest and React Testing Library, with the API mocked by MSW)

- [ ] Submitting the sign-up form calls `POST /auth/signup` and goes to the home page.
- [ ] A 409 from the API shows "That email is already registered".
- [ ] Home shows "Hello, your email" when `/me` returns a user, and redirects to `/login` on 401.

**Green**

- [ ] Set up Vite, React and React Router, with sign-up, log-in and home pages and an API client that sends cookies.
- [ ] Add a Vite dev proxy to the API, so the browser sees a single origin and cookies work without extra setup.

**Refactor**

- [ ] Put the logged-in user behind one `useSession()` hook.

### 1.10 Create and switch stores

**Red**

- [ ] The create-store form shows handle errors returned by the API.
- [ ] A newly created store appears in the switcher and becomes the active store.
- [ ] The active store survives a page reload.
- [ ] API test: a request for a store you aren't staff of returns 403.

**Green**

- [ ] Build the form and the switcher. Send the active store to the API on every request, for example in an `X-Store-Id` header, and check it against `staff_members`.

**Refactor**

- [ ] Move the active-store logic into one context or hook.

## Tasks 1.11–1.13 · Storefront

### 1.11 Storefront skeleton

**Red**

- [ ] Unit tests for `parseStoreHandle(host, platformDomain)`: `mystore.localhost:3001` → `mystore`; `MyStore.localhost` → `mystore`; `localhost` and `a.b.localhost` → none; `mystore.example.com` with platform domain `example.com` → `mystore`.
- [ ] Given a stubbed store lookup, the root loader returns the store name for the request's host.

**Green**

- [ ] Create a React Router framework-mode app on Workers with Cloudflare's Vite plugin, put `parseStoreHandle` in `shared`, and render a page that shows the store name.

**Refactor**

- [ ] Read `PLATFORM_DOMAIN` from the Worker's environment, never from code.

### 1.12 Public store lookup

**Red**

- [ ] `GET /storefront/stores/:handle` works without a login and returns only public fields: name, handle, default locale and default currency.
- [ ] An unknown handle returns 404.
- [ ] The response has a `Cache-Control` header.
- [ ] Storefront: an unknown handle renders the 404 page with HTTP status 404.

**Green**

- [ ] Add the public route and the storefront's 404 handling.

### 1.13 Hostname cache

**Red** (Cloudflare's Workers test pool, or a fake KV)

- [ ] The first lookup calls the API and stores the result in KV for 60 seconds.
- [ ] A second lookup within 60 seconds doesn't call the API.
- [ ] Unknown handles are cached too, so repeated bad subdomains don't reach the API.

**Green**

- [ ] Write `getStore(env, handle)`, which checks KV before calling the API.

**Refactor**

- [ ] Keep the cache lifetime in a single setting.

## Tasks 1.14–1.16 · CI and deploys

For infrastructure, the "failing test" is a check that fails until the setup exists.

### 1.14 CI

**Red**

- [ ] Push a branch with one deliberately failing test. The GitHub Actions run fails.

**Green**

- [ ] Write a workflow that installs with pnpm, starts a Postgres service container, migrates the test database, then runs lint, typecheck and tests.
- [ ] Fix the test, and the run turns green.

**Refactor**

- [ ] Cache pnpm and Turborepo outputs so runs are faster.

### 1.15 Deploy the API to Google Cloud

**Red**

- [ ] Write `scripts/smoke.ts <baseUrl>` to check `/health`. Run it against the Cloud Run address: it fails, since nothing is deployed yet.
- [ ] Build and run the Docker image locally. The smoke test passes against it first.

**Green**

- [ ] Write a multi-stage Dockerfile that runs as a non-root user, and push the image to Artifact Registry.
- [ ] Create Cloud SQL Postgres on the smallest tier, deploy to Cloud Run connected to it, keep secrets in Secret Manager, and run migrations before each release.
- [ ] The smoke test passes against the Cloud Run address.

**Refactor**

- [ ] Add a one-command deploy script and a budget alert in Google Cloud.

### 1.16 Deploy storefront and admin to Cloudflare

This needs your domain. Without one yet, skip it and come back later.

**Red**

- [ ] Extend the smoke test: `admin.<domain>` loads the admin app, `teststore.<domain>` shows the store name, and `nope.<domain>` returns 404. All three fail.

**Green**

- [ ] Set up the Wrangler config, a KV namespace, wildcard DNS with a Worker route on your domain, the admin app as static assets, and the API address from environment settings.
- [ ] The smoke test passes. That's the Phase 1 gate.
