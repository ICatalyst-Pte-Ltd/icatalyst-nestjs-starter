import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import {
  CursorPaginationStrategy,
  CursorPaginationStrategyConfig,
} from './cursor-pagination.strategy.js';
import { CursorPaginationOptions } from './entities/cursor-pagination.options.entity.js';
import { mockCursorPaginationOptions } from './entities/cursor-pagination.options.entity.utils.spec.js';
import { mockOffsetPaginationOptions } from './entities/offset-pagination.options.entity.utils.spec.js';
import {
  OffsetPaginationStrategy,
  OffsetPaginationStrategyConfig,
} from './offset-pagination.strategy.js';
import { PaginationService } from './pagination.service.js';
import {
  PaginationStrategy,
  PaginationStrategyConfig,
} from './pagination.types.js';

describe(PaginationService.name, () => {
  let service: PaginationService;
  let cursorBuildPaginatedArgs: Mock;
  let offsetBuildPaginatedArgs: Mock;

  beforeEach(async () => {
    cursorBuildPaginatedArgs = vi.fn();
    offsetBuildPaginatedArgs = vi.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        {
          provide: CursorPaginationStrategy,
          useValue: {
            name: 'cursor',
            buildPaginatedArgs: cursorBuildPaginatedArgs,
          },
        },
        {
          provide: OffsetPaginationStrategy,
          useValue: {
            name: 'offset',
            buildPaginatedArgs: offsetBuildPaginatedArgs,
          },
        },
      ],
    }).compile();

    service = module.get(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(PaginationService.prototype.buildPaginatedArgs.name, () => {
    it('should execute cursor pagination', () => {
      const value = { id: randomUUID() };
      cursorBuildPaginatedArgs.mockReturnValue(value);
      const args = { where: { id: randomUUID() } };
      const options = mockCursorPaginationOptions({});
      const strategy = {
        name: 'cursor',
        options,
      } satisfies CursorPaginationStrategyConfig;

      const result = service.buildPaginatedArgs({
        args,
        strategy,
      });

      expect(result).toEqual(value);
      expect(cursorBuildPaginatedArgs).toHaveBeenCalledTimes(1);
      expect(cursorBuildPaginatedArgs).toHaveBeenCalledWith({
        args,
        options,
      });
    });

    it('should execute offset pagination', () => {
      const value = { id: randomUUID() };
      offsetBuildPaginatedArgs.mockReturnValue(value);
      const args = { where: { id: randomUUID() } };
      const options = mockOffsetPaginationOptions({});
      const strategy = {
        name: 'offset',
        options,
      } satisfies OffsetPaginationStrategyConfig;

      const result = service.buildPaginatedArgs({
        args,
        strategy,
      });

      expect(result).toEqual(value);
      expect(offsetBuildPaginatedArgs).toHaveBeenCalledTimes(1);
      expect(offsetBuildPaginatedArgs).toHaveBeenCalledWith({
        args,
        options,
      });
    });

    it('should return an empty array if no strategy is found', () => {
      const args = { where: { id: randomUUID() } };
      const strategy = {
        name: 'unknown',
        options: { id: randomUUID() },
      } as unknown as PaginationStrategyConfig;

      const result = service.buildPaginatedArgs({
        args,
        strategy,
      });

      expect(result).toBe(args);
      expect(cursorBuildPaginatedArgs).not.toHaveBeenCalled();
      expect(offsetBuildPaginatedArgs).not.toHaveBeenCalled();
    });
  });

  describe('addStrategy', () => {
    type T = {
      addStrategy: PaginationService['addStrategy'];
    };

    let paginationService: T;

    beforeEach(() => {
      paginationService = service as unknown as T;
    });

    it('should throw an error if there is already an existing strategy', () => {
      const strategy = {
        name: 'cursor',
      } as PaginationStrategy<CursorPaginationOptions>;

      function toThrow() {
        paginationService.addStrategy(strategy);
      }

      expect(toThrow).toThrow(new Error('Strategy cursor already exists.'));
    });
  });
});
