---
name: nestjs-module
description: Create a NestJS feature module with service, controller, and DTOs following the project patterns under src/. Use when adding a new feature, resource, or module.
---

# NestJS module creation

## Usage

`/nestjs-module` FeatureName

## Process

### Step 1: Scaffold with the Nest CLI

Use the project's Nest generator (`@nestjs/cli`, configured in `nest-cli.json`), then adapt the files to the project patterns.

| Goal                                                         | Command                                                                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Full REST baseline: module, controller, service, specs, DTOs | `npx nest g resource <kebab-name>`                                                                                  |
| Minimal shell: module, controller, and service               | `npx nest g module <kebab-name>`, then `npx nest g controller <kebab-name>`, then `npx nest g service <kebab-name>` |

- **Name:** kebab-case (e.g. `order-lines`); the CLI creates `src/<kebab-name>/`.
- **Preview:** add `--dry-run` before writing files.
- **`app.module.ts`:** the generator appends the module to `imports`. Keep modules with controllers in **alphabetical order** and avoid duplicates.

**After the scaffold, expect to change:**

- **Imports:** the project is ESM; relative imports need the `.js` suffix (`./orders.service.js`).
- **Tests:** generated specs use Jest-style globals that Vitest also provides; replace `jest.*` with `vi.*` if present.
- **DTOs:** hand-written `class-validator` DTOs under `src/<feature>/dto/`. Reuse decorators from `src/common/transforms` and `src/common/validations`.
- **`entities/`:** persistence is Prisma; remove the generated entity stub or turn it into a response entity (see `src/common/entities/base.entity.ts`).
- **Return types:** return RxJS `Observable`s from services and controllers.
- **Controller:** thin; add Swagger decorators; route paths are kebab-case nouns.

### Step 2: Prisma model (if persistence)

1. Add or verify the model in `prisma/schema.prisma`.
2. Create a migration: `npx prisma migrate dev --name <description>`.
3. Add data access with the **`prisma-repository`** skill.

### Step 3: Configuration (if needed)

Add a `<feature>.config.ts` that validates environment variables with Joi via `validateEnv` (see `src/common/prisma/prisma.config.ts`), provide it in the module, test it with `configTests` from `src/common/testing/config-tests.utils.spec.ts`, and document the variables in `.env.sample`.

### Step 4: Module

- Declare `controllers`, `providers`, and `exports`.
- Import `PrismaModule` and other `src/common` modules (`CacheModule`, `AWSModule`, `EmailModule`, …) as required.
- Test the module wiring with `moduleTests` from `src/common/testing/module-tests.utils.spec.ts`.

### Step 5: Validate

```bash
npm run lint
npm run test
npm run build
```

Then run **`verify-app-startup`** (with user permission to start the API) and **`verify-e2e-tests`**.

## Conventions

- Directory and files: kebab-case; classes `FeatureModule`, `FeatureController`, `FeatureService`.
- Tests: adjacent `*.spec.ts`; async/await; `firstValueFrom` / `lastValueFrom` for Observables.

## File structure (typical)

```
src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.controller.spec.ts
├── <feature>.service.ts
├── <feature>.service.spec.ts
├── <feature>.prisma.ts   # optional, see prisma-repository
└── dto/
    └── *.dto.ts
```
