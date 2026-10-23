# Singularity — Build tasks

64 small tasks from empty folders to public launch, plus 4 optional Kubernetes tasks after it.
Tick `[x]` in the **Me** and **Claude** columns as each version is done.

## Rules

- **You go first.** Build each task in `mine/`, then give the same task to Claude Code in `claude/`.
- **Claude Code may read `mine/`, but never follows it.** It builds from these docs alone (see `claude/CLAUDE.md`).
- **Same task, same ID.** Start commit messages with the task ID, e.g. `1.6: sign-up and log-in API`.
- **Only your code deploys** to the real domain. On deploy tasks, Claude writes config only.
- **Separate ports.** `mine`: Postgres 5432, apps 3000–3099. `claude`: Postgres 5433, apps 3100–3199.
- **The domain is a setting.** Both read `PLATFORM_DOMAIN` (`localhost` in development).

## The loop for every task

1. Read the task below and its Red list in `TDD_PHASE_1.md` (later phases get their own file).
2. Build it test-first in `mine/`, then commit with the task ID.
3. Open Claude Code inside `claude/` and paste the prompt below, filled in.
4. Compare the two commits. Optionally ask Claude Code to compare both versions and explain the trade-offs.
5. Tick both boxes.

Prompt for Claude Code:

```text
Task 1.6 — Sign-up and log-in API.
Build: <paste the Task text>
Done when: <paste the Done when text>
Tests to write first: <paste the Red list from TDD_PHASE_1.md>

Write code only inside this folder, and build it from this task alone, not from ../mine.
First show me a short plan and wait for my OK.
Then implement it test-first, run the tests, and commit as "1.6: <title>".
Finish with 3–5 bullets on the key decisions you made and why.
```

## Phase 1 · Foundation

By the end, a creator can sign up, create a store and see it live on its own subdomain.

| # | Task | Done when | Me | Claude |
| --- | --- | --- | --- | --- |
| 1.1 | **Monorepo skeleton:** pnpm workspaces + Turborepo; empty apps (api, admin, storefront) and packages (db, shared); strict TypeScript, ESLint, Prettier | `pnpm build` and `pnpm lint` pass | [x] | [x] |
| 1.2 | **Local services:** Docker Compose with Postgres and Mailpit, which catches outgoing email | You can connect with psql and open the Mailpit inbox | [ ] | [ ] |
| 1.3 | **API hello world:** Fastify app with env validation (Zod), structured logs, `/health`, first Vitest test | `GET /health` returns `{"ok":true}` and the test passes | [ ] | [ ] |
| 1.4 | **Database setup:** Drizzle connection, migration scripts, first migration with a `stores` table | Migrations run cleanly on a fresh local database | [ ] | [ ] |
| 1.5 | **Users and staff schema:** `users`, `sessions`, `staff_members` (user ↔ store + role), seed script | The seed creates one user who owns one store | [ ] | [ ] |
| 1.6 | **Sign-up and log-in API:** email + password hashed with argon2, httpOnly session cookie, log-out | Tests cover sign-up, wrong password and log-out | [ ] | [ ] |
| 1.7 | **Row-level security:** RLS policies on store tables; the API sets the current store per request inside a transaction | A test proves a request for store A can't read store B's rows | [ ] | [ ] |
| 1.8 | **Create-store API:** `POST /stores` with name + handle (the subdomain); the caller becomes owner | Tests reject duplicate and invalid handles | [ ] | [ ] |
| 1.9 | **Admin app skeleton:** React + Vite + React Router; sign-up and log-in pages calling the API | You can sign up and see "Hello, your email" | [ ] | [ ] |
| 1.10 | **Create and switch stores:** create-store form and a store switcher in admin | You can create two stores and switch between them | [ ] | [ ] |
| 1.11 | **Storefront skeleton:** React Router framework mode on Workers; picks the store from the hostname, with the platform domain read from config | `yourhandle.localhost` shows that store's name | [ ] | [ ] |
| 1.12 | **Public store lookup:** read-only API endpoint that finds a store by handle; 404 page for unknown hosts | An unknown subdomain shows a friendly 404 page | [ ] | [ ] |
| 1.13 | **Hostname cache:** the Worker caches hostname → store lookups in Cloudflare KV for 60 seconds | Logs show a cache hit on the second request | [ ] | [ ] |
| 1.14 | **CI:** GitHub Actions run lint, type-check and tests on every push | A green check on GitHub | [ ] | [ ] |
| 1.15 | **Deploy the API to Google Cloud:** Dockerfile, Cloud SQL Postgres, Cloud Run, secrets in Secret Manager. Claude: config only | `/health` responds over HTTPS on Cloud Run | [ ] | [ ] |
| 1.16 | **Deploy storefront and admin to Cloudflare:** a wildcard route on your platform domain sends every store subdomain to the storefront Worker; `admin.` goes to the admin app. Needs the domain bought. Claude: config only | Gate: a new store goes live on its own subdomain | [ ] | [ ] |

## Phase 2 · Sell

By the end, a store can take a real payment and deliver what was bought. Gate: switch one store to Stripe live mode and make the first real sale.

| # | Task | Done when | Me | Claude |
| --- | --- | --- | --- | --- |
| 2.1 | **Product schema:** products, variants, prices (integer minor units + currency), collections; money helpers in `shared` | Migrations run and money helper tests pass, with no floats | [ ] | [ ] |
| 2.2 | **Product API:** create, list, update and archive products and variants for the current store | Tests pass, including a blocked cross-store request | [ ] | [ ] |
| 2.3 | **Admin product screens:** product list and a create/edit form with variants | You can create a T-shirt with three sizes | [ ] | [ ] |
| 2.4 | **Image upload:** signed upload URLs to R2, asset records, thumbnails in admin | An uploaded image shows in the product form | [ ] | [ ] |
| 2.5 | **Private digital files:** upload digital-product files to a private R2 bucket | The file uploads, and no public URL can reach it | [ ] | [ ] |
| 2.6 | **Theme schema:** section types (hero, product grid, product detail, rich text) with settings schemas; template type and validator in `shared` | Unit tests accept a good template and reject bad ones | [ ] | [ ] |
| 2.7 | **Default theme:** React section components that render a template on the storefront | The home page renders from a seeded template | [ ] | [ ] |
| 2.8 | **Product and collection pages:** server-rendered pages with SEO and Open Graph tags | View-source shows the product title and Open Graph tags | [ ] | [ ] |
| 2.9 | **Theme editor v1:** add, remove, reorder and edit sections with forms built from the schema; saves a draft | A changed hero heading shows in the editor preview | [ ] | [ ] |
| 2.10 | **Preview and publish:** live preview of the draft; publishing copies draft to published and clears the cache | A published change appears on the storefront within seconds | [ ] | [ ] |
| 2.11 | **Cart:** add, update and remove lines; server-side cart linked to a cookie | The cart survives a page refresh | [ ] | [ ] |
| 2.12 | **Discount codes:** percentage or fixed amount, start and end dates, usage limit | A valid code applies; an expired code is rejected | [ ] | [ ] |
| 2.13 | **Stripe Connect onboarding:** creators connect a Stripe account from admin, in test mode | A test connected account shows payouts enabled | [ ] | [ ] |
| 2.14 | **Checkout:** payment on the creator's Stripe account with the platform fee, using Stripe's Payment Element | A test card payment succeeds | [ ] | [ ] |
| 2.15 | **Orders from webhooks:** verify Stripe webhook signatures; create the order and lines, copying titles and prices at time of sale | Replaying the same webhook doesn't create a duplicate order | [ ] | [ ] |
| 2.16 | **Background jobs:** queue jobs from the API and run them in a worker service (a local runner now, Cloud Tasks when deployed) | An order-paid job runs exactly once | [ ] | [ ] |
| 2.17 | **Order emails:** confirmation email with an order summary | The email arrives in Mailpit | [ ] | [ ] |
| 2.18 | **Digital delivery:** download links that expire and have a download limit | A link works 3 times, then stops; it expires after 24 hours | [ ] | [ ] |
| 2.19 | **Admin orders:** order list and detail; mark physical orders shipped and email the buyer | The shipped email arrives in Mailpit | [ ] | [ ] |
| 2.20 | **Refunds:** full or partial refunds from admin through Stripe; a webhook updates the order | The refund shows in Stripe's test dashboard and on the order | [ ] | [ ] |
| 2.21 | **Customers:** customer list with CSV export | The exported CSV opens in a spreadsheet with the right rows | [ ] | [ ] |

## Phase 3 · Go global

By the end, shoppers browse and pay in their own language and currency, and creators pay for plans. Gate: sales in 2+ currencies and a first paid plan.

| # | Task | Done when | Me | Claude |
| --- | --- | --- | --- | --- |
| 3.1 | **Store languages:** creators choose languages; a translations table; the API returns content in the requested language, with fallback | Tests cover a missing translation falling back to the default | [ ] | [ ] |
| 3.2 | **Translations in admin:** a tab per language on product and collection forms | A product shows its Japanese title once the Japanese tab is filled | [ ] | [ ] |
| 3.3 | **Language routing:** `/ja/...` paths, a language switcher, `hreflang` tags | Switching language keeps you on the same page | [ ] | [ ] |
| 3.4 | **Translatable theme text:** text settings hold one value per language | The hero heading changes with the language | [ ] | [ ] |
| 3.5 | **Translation drafts:** a Translate button fills draft translations through a translation API (e.g. the Claude API) for the creator to review | Drafts stay unpublished until the creator approves them | [ ] | [ ] |
| 3.6 | **Exchange rates:** a daily job stores FX rates | Today's rates are in the database after the job runs | [ ] | [ ] |
| 3.7 | **Local prices:** convert base prices with per-currency rounding; an optional fixed price per currency overrides it | Unit tests pass for USD, EUR, JPY (no decimals) and THB | [ ] | [ ] |
| 3.8 | **Charge in the shopper's currency:** where Stripe supports it; otherwise fall back to the store currency | A test payment succeeds in a second currency, or falls back cleanly | [ ] | [ ] |
| 3.9 | **Tax at checkout:** Stripe Tax calculates tax from the buyer's address; creators add their tax registrations | A test order shows a calculated tax line | [ ] | [ ] |
| 3.10 | **Custom domains:** creators add a domain; the API creates a Cloudflare for SaaS custom hostname and shows DNS steps and status | A test domain serves the store over HTTPS | [ ] | [ ] |
| 3.11 | **Platform plans:** Free, Pro and Business through Stripe Billing on your platform account | A test store upgrades to Pro and its plan updates | [ ] | [ ] |
| 3.12 | **Fee rules:** fee rate by plan (5% / 1% / 0%); automatic fee for Thai creators, fees owed recorded for overseas creators | Tests cover each plan and both kinds of creator | [ ] | [ ] |
| 3.13 | **Fees on invoices:** a monthly job adds fees owed to each overseas creator's subscription invoice | A test invoice shows the fee line | [ ] | [ ] |
| 3.14 | **Privacy tools:** cookie consent banner; export and delete one customer's data | An export contains only that customer's data | [ ] | [ ] |

## Phase 4 · Pilot to launch

By the end, Singularity is safe to run, creators can onboard themselves, and sign-ups are open. Start recruiting pilot creators during Phase 2.

| # | Task | Done when | Me | Claude |
| --- | --- | --- | --- | --- |
| 4.1 | **Onboarding wizard:** store name → theme → first product → connect payments | Someone new reaches a live store in under 10 minutes | [ ] | [ ] |
| 4.2 | **Basic analytics:** daily page views, orders and revenue in admin | The numbers match a set of test orders | [ ] | [ ] |
| 4.3 | **Audit log:** record refunds, payout changes, staff changes and admin log-ins | Each of those actions creates an audit entry | [ ] | [ ] |
| 4.4 | **Platform admin:** list stores and plans; impersonate a store for support, always logged | Every impersonation appears in the audit log | [ ] | [ ] |
| 4.5 | **Rate limits:** limit log-in, sign-up and checkout requests per IP and per account | Too many attempts get a 429 response | [ ] | [ ] |
| 4.6 | **Security review:** run a Claude Code security review, check RLS covers every store table, fix the findings | No high-severity findings left open | [ ] | [ ] |
| 4.7 | **Monitoring:** error tracking, uptime checks and alerts | A forced error triggers an alert | [ ] | [ ] |
| 4.8 | **Backups:** automated Cloud SQL backups and a restore drill. Claude: runbook only | A restore into a scratch database succeeds | [ ] | [ ] |
| 4.9 | **Production readiness:** budget alerts, Cloud Run scaling limits, database connection pooling. Claude: config only | Budget alerts are set and a basic load test runs without errors | [ ] | [ ] |
| 4.10 | **Bring-your-own gateway:** a `PaymentProvider` interface plus a PayPal adapter | A PayPal sandbox payment creates an order | [ ] | [ ] |
| 4.11 | **Help and legal pages:** creator FAQ, terms, privacy policy; have a lawyer review the legal text | The pages are live and linked in the footer | [ ] | [ ] |
| 4.12 | **Landing page:** marketing page on your platform domain, with sign-up | A visitor can sign up from the landing page | [ ] | [ ] |
| 4.13 | **Pilot and launch:** onboard the first creators, fix the top issues, open sign-ups. Claude: skip | Gate: 10 paying merchants | [ ] | — |

## Optional · Kubernetes learning track (after launch)

Move the API to GKE Autopilot as a learning exercise and compare it with Cloud Run. Production stays on Cloud Run unless the comparison clearly favors Kubernetes. Delete the cluster when you finish; it costs money while it runs.

| # | Task | Done when | Me | Claude |
| --- | --- | --- | --- | --- |
| 5.1 | **Kubernetes locally:** run the API in a local cluster (kind or minikube) with a Deployment, Service, ConfigMap and Secret | `/health` answers through `kubectl port-forward` | [ ] | [ ] |
| 5.2 | **API on GKE Autopilot:** push the image to Artifact Registry, apply the manifests, connect to Cloud SQL through the Cloud SQL Auth Proxy, expose it over HTTPS. Claude: config only | `/health` responds over HTTPS from the cluster | [ ] | [ ] |
| 5.3 | **Scaling and safe rollouts:** readiness and liveness probes, a HorizontalPodAutoscaler, rolling updates | A load test adds pods, and a broken release never receives traffic | [ ] | [ ] |
| 5.4 | **Compare and decide:** run both for a week; compare monthly cost, response times and hours spent on operations; record the decision | The decision is written down and the cluster is deleted, unless you chose to keep it | [ ] | [ ] |
