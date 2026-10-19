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
  let cursorPagination: CursorPaginationStrategy;
  let offsetPagination: OffsetPaginationStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        {
          provide: CursorPaginationStrategy,
          useValue: { name: 'cursor', buildPaginatedArgs: vi.fn() },
        },
        {
          provide: OffsetPaginationStrategy,
          useValue: { name: 'offset', buildPaginatedArgs: vi.fn() },
        },
      ],
    }).compile();

    service = module.get(PaginationService);
    cursorPagination = module.get(CursorPaginationStrategy);
    offsetPagination = module.get(OffsetPaginationStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(PaginationService.prototype.buildPaginatedArgs.name, () => {
    it('should execute cursor pagination', () => {
      const value = { id: randomUUID() };
      cursorPagination.buildPaginatedArgs = vi.fn().mockReturnValue(value);
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
      expect(cursorPagination.buildPaginatedArgs).toHaveBeenCalledTimes(1);
      expect(cursorPagination.buildPaginatedArgs).toHaveBeenCalledWith({
        args,
        options,
      });
    });

    it('should execute offset pagination', () => {
      const value = { id: randomUUID() };
      offsetPagination.buildPaginatedArgs = vi.fn().mockReturnValue(value);
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
      expect(offsetPagination.buildPaginatedArgs).toHaveBeenCalledTimes(1);
      expect(offsetPagination.buildPaginatedArgs).toHaveBeenCalledWith({
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
      expect(cursorPagination.buildPaginatedArgs).not.toHaveBeenCalled();
      expect(offsetPagination.buildPaginatedArgs).not.toHaveBeenCalled();
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
