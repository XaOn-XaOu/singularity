# Singularity · claude/

Claude Code's build of Singularity, a multi-merchant commerce platform for creators. The specs are in [`../docs`](../docs).

Needs Node.js 24+, pnpm and Docker Desktop.

## Local services

Postgres and Mailpit run in Docker. Mailpit catches every email the apps send, so nothing reaches a real inbox.

1. Copy `.env.example` to `.env`.
2. `pnpm services:up` starts both and returns once their health checks pass.
3. `pnpm services:down` stops them. The data stays in a Docker volume; `docker compose down -v` deletes it.

| Service       | Address                 | Notes                                                                           |
| ------------- | ----------------------- | ------------------------------------------------------------------------------- |
| Postgres      | `localhost:5433`        | Databases `singularity` and `singularity_test`; user and password `singularity` |
| Mailpit inbox | <http://localhost:8026> | Web page listing every caught email                                             |
| Mailpit SMTP  | `localhost:1026`        | No authentication                                                               |

To open psql without installing it, use the one inside the container:

```bash
docker compose exec postgres psql -U singularity
```

## Commands

`pnpm build`, `pnpm lint`, `pnpm typecheck` and `pnpm test` run across every package. `pnpm test` needs the services running.
