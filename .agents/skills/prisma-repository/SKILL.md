---
name: prisma-repository
description: Add Prisma-backed data access for a model using PrismaService and AbstractPrisma. Use when a feature needs to read or write a database table.
---

# Prisma data access

Use **`PrismaService`** and, preferably, a small helper extending **`AbstractPrisma`** from `src/common/prisma` (see `src/common/prisma/abstract.prisma.ts`). `AbstractPrisma` wraps the Prisma delegate in RxJS `Observable`s and adds pagination (`cursor` / `offset`) and sorting support to `findMany`.

## Usage

`/prisma-repository` ModelName

## Process

### Step 1: Verify the Prisma model

Confirm the model in `prisma/schema.prisma` has the fields and relations the feature needs. Cursor pagination requires `id` and `createdAt` columns.

After schema changes:

```bash
npx prisma migrate dev --name <description>
npx prisma generate
```

### Step 2: Create the Prisma helper

**Location:** `src/<feature>/<feature>.prisma.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AbstractPrisma } from '../common/prisma/index.js';

@Injectable()
export class OrderPrisma extends AbstractPrisma<'order'> {
  constructor(moduleRef: ModuleRef) {
    super('order', moduleRef);
  }
}
```

- The generic is the Prisma client delegate name (camelCase model name, e.g. `'order'`).
- Register the helper in the feature module `providers`; the module must import `PrismaModule`.
- Model and input types come from the generated client: `import { Prisma } from '~prisma';`.

### Step 3: Use it in the service

```typescript
findAll(options?: FindManyOptions): Observable<Array<Order>> {
  return this.prisma.findMany({ where: { deletedAt: null } }, options);
}

findOne(id: string): Observable<Order> {
  return this.prisma
    .findUniqueOrThrow({ where: { id } })
    .pipe(handlePrismaErrors({}, this.logger));
}
```

Error helpers exported from `src/common/prisma/index.ts`:

- `handlePrismaErrors(overrideFactories, logger)` maps `P2002` to `ConflictException` and `P2017`/`P2025` to `NotFoundException`; pass factories keyed by error code to override.
- `isRecordNotFoundError`, `isUniqueConstraintViolation` for manual checks.
- `PaginationOptions`, `createFindManyResult`, `createOrderBy` for paginated, sortable list endpoints.

### Step 4: Tests

- Test the service with the helper mocked (`{ provide: OrderPrisma, useValue: { findMany: vi.fn() } }`).
- Test the helper itself like `src/common/prisma/abstract.prisma.spec.ts`; add the new delegate to its `delegates` list.
- Cover real database behavior in `test/*.e2e-spec.ts` (see `test/prisma-example.e2e-spec.ts`).

### Step 5: Validate

```bash
npm run lint
npm run test
npm run build
```

Then run **`verify-app-startup`** (with user permission) and **`verify-e2e-tests`**.

## Conventions

- File names: kebab-case (`order-lines.prisma.ts`).
- Keep helpers thin; business logic stays in services.
- Never rewrite migrations that have been deployed.
