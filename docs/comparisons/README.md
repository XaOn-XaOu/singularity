# Comparisons

One file per task, comparing `mine/` with `claude/`: which version is better where, and what to carry forward. This index lists every comparison and tracks the follow-ups that are still open.

## Tasks

| Task | Compared | Verdict | File |
| --- | --- | --- | --- |
| 1.1 Monorepo skeleton | 2026-10-24 | The two converged. Mine is better on the exact Prettier pin and a real README; claude on ESLint ignores, `.js` handling and keeping pnpm's root check. | [1.1-monorepo-skeleton.md](1.1-monorepo-skeleton.md) |

## Open follow-ups

Tick an item here when it's done, then move it to Closed.

- [ ] **mine:** add a final newline to `README.md`, so `pnpm lint` passes again. From [1.1](1.1-monorepo-skeleton.md); fix during 1.2.
- [ ] **both:** add `"inputs": ["$TURBO_DEFAULT$", ".env*"]` to `turbo.json`'s `build` task. From [1.1](1.1-monorepo-skeleton.md#a-gap-in-both); do in 1.2, when `.env` files appear.
- [ ] **claude:** pin Prettier to an exact version. From [1.1](1.1-monorepo-skeleton.md#where-mine-is-better); waiting for the owner's OK.

## Closed follow-ups

None yet.

## Adding a task

1. Create `<id>-<short-title>.md`, e.g. `1.2-local-services.md`.
2. Use the same sections as [1.1](1.1-monorepo-skeleton.md): Commits compared · Verification of mine · How each was built · Where mine is better · Where claude is better · Trade-offs · A gap in both · Problems found along the way · Lessons · Follow-ups raised. Skip any section with nothing to say.
3. Add a row to **Tasks** above, and its follow-ups to **Open follow-ups**.
