import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { DelegateName, FindMany } from '../prisma.types.js';
import { OffsetPaginationOptions } from './entities/offset-pagination.options.entity.js';
import { PaginationStrategy } from './pagination.types.js';

const name = 'offset';

export interface OffsetPaginationStrategyConfig {
  readonly name: 'offset';
  readonly options: OffsetPaginationOptions;
}

@Injectable()
export class OffsetPaginationStrategy implements PaginationStrategy<OffsetPaginationOptions> {
  public readonly name = name;

  buildPaginatedArgs<
    A extends Prisma.Args<PrismaClient[DelegateName], FindMany>,
  >({
    args,
    options: { skip, take },
  }: {
    args?: A;
    options: OffsetPaginationOptions;
  }): A {
    const newArgs = structuredClone(args ?? ({} as A));
    newArgs.skip = skip ?? 0;
    newArgs.take = take;
    return newArgs;
  }
}
