import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { DelegateName, FindMany } from '../prisma.types.js';
import { CursorPaginationOptions } from './entities/cursor-pagination.options.entity.js';
import { PaginationStrategy } from './pagination.types.js';

const name = 'cursor';

export interface CursorPaginationStrategyConfig {
  readonly name: typeof name;
  readonly options: CursorPaginationOptions;
}

@Injectable()
export class CursorPaginationStrategy implements PaginationStrategy<CursorPaginationOptions> {
  public readonly name = name;

  buildPaginatedArgs<
    A extends Prisma.Args<PrismaClient[DelegateName], FindMany>,
  >({
    args,
    options: { createdAt, id, take },
  }: {
    args?: A;
    options: CursorPaginationOptions;
  }): A {
    const newArgs = structuredClone(args ?? ({} as A));
    if (createdAt && id) {
      newArgs.cursor = { createdAt, id };
      newArgs.skip = 1;
    }
    newArgs.orderBy = [{ createdAt: 'asc' }, { id: 'asc' }];
    newArgs.take = take;
    return newArgs;
  }
}
