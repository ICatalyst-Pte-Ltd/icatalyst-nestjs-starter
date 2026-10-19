# Agent guidelines

Applies to the main coding agent in any supported CLI (e.g. Claude Code, Cursor). Skills live in **`.agents/skills/`**.

## Hard prohibitions

**Data**: Prefer non-destructive fixes; ask before deletes. No destructive Prisma commands (`migrate reset`, `db push --force-reset`) or record deletes without permission. Schema changes go through Prisma migrations, not ad-hoc SQL.

**Services**: Do not start, stop, restart, or kill processes (including `npm run start:dev`, Docker, database, Redis) without explicit permission. If something looks wrong, report it; the user manages lifecycle.

**Git**: Never `git commit` or `git push` on protected branches (`main`). `git commit` and `git push` on other branches only when the user explicitly asks; `git add` only as part of a requested commit. No attribution lines (Co-authored-by, Generated-by) in commit messages.

**Console**: No `console.*` unless the user asks (`no-console` is an error).

## Scope and edits

Make only requested changes; no drive-by cleanup. Prefer editing existing files. Don't create docs unless asked. If intent or conflicts with existing code are unclear, ask first.

## Quality gates (before "done" on code changes)

Run in order: **`npm run lint`** → **`npm run test`** → **`npm run build`** → **`verify-app-startup`** (`.agents/skills/verify-app-startup/SKILL.md`) → **`verify-e2e-tests`** (`.agents/skills/verify-e2e-tests/SKILL.md`) when the change affects application runtime. Fix failures you introduce; don't claim completion without running these.

## Testing

- **Vitest** with globals (`describe`, `it`, `vi`); unit tests are adjacent `*.spec.ts`, e2e tests are `test/*.e2e-spec.ts`.
- Use **async/await**, not `done()` callbacks. For Observables use `firstValueFrom` / `lastValueFrom` from `rxjs`.
- Mock ES modules with `vi.mock()` (use `vi.hoisted()` for shared mock state); `vi.spyOn` does not work on ES module namespaces.
- Mocks invoked with `new` must use `function` or `class` implementations, not arrow functions.
- `*.utils.spec.ts` files are reusable test utilities (e.g. `src/common/testing/`), not test suites.
- `vitest.setup.ts` loads `reflect-metadata` and silences the Nest `Logger`.

## Project facts

- NestJS 12 + Express, TypeScript, **ESM** (`"type": "module"`): relative imports must use the **`.js`** suffix (e.g. `./app.module.js`, `./common/prisma/index.js`).
- PostgreSQL + **Prisma 7** (`prisma/schema.prisma`, `prisma.config.ts`); the generated client is in `src/generated/prisma` (git-ignored) and imported via the **`~prisma`** alias. Run `npx prisma generate` after schema changes.
- Shared building blocks live in **`src/common/`**: `health` and `info` registries, `prisma` (`AbstractPrisma`, pagination, sorting), `cache`, `redis`, `bullmq`, `event-emitter`, `aws`, `email`, `proxy`, `interceptors`, `transforms`, `validations`, `regex`, `rxjs`, `testing`.
- Configuration classes (`*.config.ts`) validate environment variables with **Joi** via `validateEnv`; document new variables in `.env.sample`.
- Health checks and info: extend `AbstractHealthIndicator` / `AbstractInfo` and register the provider in the feature module; `/health` and `/info` pick them up automatically.
- Lint with **oxlint** (`oxlint.config.ts`), format with **Prettier**.
- **TypeScript arrays**: prefer `Array<T>` / `ReadonlyArray<T>` over `T[]`.
- **Object properties**: order keys alphabetically when there is no established semantic or API-required order.
- RxJS-heavy: services return `Observable`s and use `pipe` chains.
- Prisma: `npx prisma migrate dev` locally, `migrate deploy` in CI/prod; don't rewrite deployed migrations.

```bash
npm run lint && npm run test && npm run build
npx prisma migrate dev | migrate deploy | generate
./scripts/test-e2e
```

## Commits

Conventional commits (enforced by commitlint): **`type(scope): summary`**. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Skills

| Skill                | Use when                                          |
| -------------------- | ------------------------------------------------- |
| `nestjs-module`      | Creating a new feature module under `src/`        |
| `prisma-repository`  | Adding Prisma-backed data access for a model      |
| `verify-app-startup` | Smoke-testing `/health` and `/info` after a build |
| `verify-e2e-tests`   | Running the e2e suite via `./scripts/test-e2e`    |

Priorities when they conflict: data safety → security → verified validation → efficiency.
