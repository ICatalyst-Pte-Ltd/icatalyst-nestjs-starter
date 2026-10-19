---
name: verify-app-startup
description: Verifies the Nest API starts and the public /health and /info endpoints report healthy status. Use after npm run build as the final quality gate for application code changes.
---

# Verify app startup (health + info)

Run this **after** `npm run lint`, `npm run test`, and `npm run build` for application code changes.

## When to run

- **Always** after the build gate when the change affects runtime behavior, bootstrap, configuration, dependencies, Prisma schema/migrations, or module wiring.
- **Skip** for docs-only or comment-only changes.

## Service lifecycle (requires permission)

Per `AGENTS.md`, do not start or stop the API or its dependencies without **explicit user permission**.

1. Ensure the backing services are reachable: **PostgreSQL** and **Redis** (`./scripts/up` or `docker compose --file compose.yml --file compose.local.yml up --detach --wait database redis`).
2. Ensure `.env` has at least `APP_URL`, `CORS_ALLOWED_ORIGINS`, and `DATABASE_URL` (see `.env.sample`) and migrations are applied (`npx prisma migrate deploy`).
3. Start the built app in the background:
   ```bash
   npm run start:prod &
   APP_PID=$!
   ```
4. Wait for the port (default **`APP_PORT=3000`**) to accept HTTP, then probe.
5. **Stop** the process when finished (`kill $APP_PID`).

If permission is not granted, stop and tell the user what to run; do not mark the task complete.

## Probes (both required)

Base URL: `http://127.0.0.1:${APP_PORT:-3000}`.

### `GET /health`

```bash
curl -sf "http://127.0.0.1:${APP_PORT:-3000}/health"
```

**Pass** when HTTP **200** and `status` is **`"ok"`** with no `down` entries under `error`.

### `GET /info`

```bash
curl -sf "http://127.0.0.1:${APP_PORT:-3000}/info"
```

**Pass** when HTTP **200** and:

- `extensions.database.status` is **`"up"`**
- `extensions.cache.stores` has at least one store with **`status: "up"`**
- Any other registered extensions report **`"up"`**; if a dependency is intentionally absent, say so explicitly.

## On failure — stop and report

1. Which probe failed (or whether the process failed to start).
2. Response snippet or exit code (no secrets).
3. Likely cause (database/Redis down, port conflict, environment validation, missing migration, missing `CORS_ALLOWED_ORIGINS`).
4. Fix or next step.

## On success

State that `/health` returned `status: "ok"`, `/info` reported the extensions up, the port used, and that the process was stopped. Then continue with **`verify-e2e-tests`**.
