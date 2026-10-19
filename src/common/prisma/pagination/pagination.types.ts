import { Prisma, PrismaClient } from '~prisma/client.js';
import { DelegateName, FindMany } from '../prisma.types.js';
import { CursorPaginationStrategyConfig } from './cursor-pagination.strategy.js';
import { BasePaginationOptions } from './entities/base-pagination.options.entity.js';
import { OffsetPaginationStrategyConfig } from './offset-pagination.strategy.js';

export type PaginationStrategyConfig =
  CursorPaginationStrategyConfig | OffsetPaginationStrategyConfig;

export interface PaginationStrategy<Options extends BasePaginationOptions> {
  /**
   * The name of the strategy for pagination.
   */
  readonly name: string;

  /**
   * Returns a new instance of the given `args` parameter (using structured cloning) that has the
   * appropriate properties set based on the given `options`.
   *
   * **NOTE**: If the given `args` contains the properties to be set, the value can be overwritten by
   * the values given in the `options` parameter.
   *
   * @param params Contains the `args` and `options` parameters.
   * @param params.args The arguments that is passed to the Prisma client.
   * @param params.options The options that is used to set properties in the `args`.
   * @returns a new instance of the `args` that has the appropriate properties set.
   */
  buildPaginatedArgs<
    A extends Prisma.Args<PrismaClient[DelegateName], FindMany>,
  >(params: {
    args?: A;
    options: Options;
  }): A;
}
