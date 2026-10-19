---
name: verify-e2e-tests
description: Runs the end-to-end tests via ./scripts/test-e2e after unit tests, build, and startup verification. Use as the final quality gate for application code changes.
---

# Verify e2e tests

Run this **after** `npm run lint`, `npm run test`, `npm run build`, and **`verify-app-startup`** for application code changes.

## When to run

- **Always** for changes to HTTP handlers, modules, Prisma schema/migrations, configuration, or dependencies.
- **Skip** for docs-only or comment-only changes.

## Service lifecycle (requires permission)

`./scripts/test-e2e` starts Docker Compose services; per `AGENTS.md`, do not run it without **explicit user permission**.

The script:

1. Starts **`database`** and **`redis`** via `compose.yml` + `compose.local.yml`.
2. Sets **`DATABASE_NAME=tests`** so development data is not wiped.
3. Runs **`npx prisma migrate deploy`**.
4. Runs **`npm run test:e2e`** (Vitest with `vitest.config.e2e.ts`).

## Command

```bash
./scripts/test-e2e
```

**Pass** when the script exits **0** and all e2e suites pass.

## Prerequisites

- Docker running.
- `.env` configured from `.env.sample` (`DATABASE_URL` built from the `DATABASE_*` variables, Redis settings).

## On failure — stop and report

1. Which step failed (compose, migrate, or tests).
2. Relevant log excerpt (no secrets).
3. Likely cause (Docker down, port conflict, migration drift, assertion).
4. Fix or next step.

## On success

State that `./scripts/test-e2e` exited 0 against `DATABASE_NAME=tests`.

## Notes

- Prefer `./scripts/test-e2e` over bare `npm run test:e2e`; it provisions dependencies and isolates the database.
- CI runs `npm run test:e2e` with Postgres and Redis services (`.gitlab-ci.yml`).
