import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '~prisma/client.js';
import { DelegateName, FindMany } from '../prisma.types.js';
import { CursorPaginationStrategy } from './cursor-pagination.strategy.js';
import { OffsetPaginationStrategy } from './offset-pagination.strategy.js';
import {
  PaginationStrategy,
  PaginationStrategyConfig,
} from './pagination.types.js';

type Options = PaginationStrategyConfig['options'];

@Injectable()
export class PaginationService {
  readonly #logger = new Logger(PaginationService.name);
  private readonly strategies = new Map<string, PaginationStrategy<Options>>();

  constructor(
    cursorStrategy: CursorPaginationStrategy,
    offsetStrategy: OffsetPaginationStrategy,
  ) {
    this.addStrategy(cursorStrategy);
    this.addStrategy(offsetStrategy);
  }

  buildPaginatedArgs<
    A extends Prisma.Args<PrismaClient[DelegateName], FindMany>,
  >({
    args,
    strategy: { name, options },
  }: {
    args?: A;
    strategy: PaginationStrategyConfig;
  }): A | undefined {
    this.#logger.debug({
      method: this.buildPaginatedArgs.name,
      args,
      strategy: { name, options },
    });
    const strategy = this.getStrategy(name);
    if (strategy == undefined) {
      this.#logger.warn({
        method: this.buildPaginatedArgs.name,
        message: 'No strategy found!',
        strategy: { name, options },
      });
      return args;
    }
    return strategy.buildPaginatedArgs({ args, options });
  }

  private addStrategy(strategy: PaginationStrategy<Options>): void {
    const name = strategy.name;
    if (this.strategies.has(name)) {
      throw new Error(`Strategy ${name} already exists.`);
    }
    this.strategies.set(name, strategy);
  }

  private getStrategy(
    strategy: string,
  ): PaginationStrategy<Options> | undefined {
    return this.strategies.get(strategy);
  }
}
