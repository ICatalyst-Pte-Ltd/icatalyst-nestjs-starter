import { PrismaClient } from '~prisma/client.js';
import { PaginationStrategyConfig } from './pagination/pagination.types.js';
import { OrderBy } from './sorting/create-order-by.js';

export type DelegateName = Exclude<
  Extract<keyof PrismaClient, string>,
  `$${string}`
>;

export type FindMany = 'findMany';

export interface FindManyOptions {
  /**
   * The pagination options to use.
   */
  readonly pagination?: PaginationStrategyConfig;

  /**
   * The sorting options to use.
   */
  readonly orderBy?: OrderBy['orderBy'];
}
