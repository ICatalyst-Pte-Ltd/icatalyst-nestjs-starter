import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { CursorPaginationStrategy } from './cursor-pagination.strategy.js';
import { CursorPaginationOptions } from './entities/cursor-pagination.options.entity.js';
import { mockCursorPaginationOptions } from './entities/cursor-pagination.options.entity.utils.spec.js';

describe(CursorPaginationStrategy.name, () => {
  let pagination: CursorPaginationStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursorPaginationStrategy],
    }).compile();

    pagination = module.get(CursorPaginationStrategy);
  });

  it('should be defined', () => {
    expect(pagination).toBeDefined();
    expect(pagination.name).toBe('cursor');
  });

  describe(CursorPaginationStrategy.prototype.buildPaginatedArgs.name, () => {
    it('should correctly return a new instance of args with the right properties added', () => {
      const args = { where: { id: randomUUID() } };
      const options = mockCursorPaginationOptions({});

      const result = pagination.buildPaginatedArgs({ args, options });

      expect(result).toEqual({
        ...args,
        cursor: { createdAt: options.createdAt, id: options.id },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        skip: 1,
        take: options.take,
      });
      expect(result).not.toBe(args);
    });

    it.each<{ property: keyof CursorPaginationOptions }>([
      { property: 'createdAt' },
      { property: 'id' },
    ])(
      'should not add a cursor and skip property if $property is undefined',
      ({ property }) => {
        const args = { where: { id: randomUUID() } };
        const options = mockCursorPaginationOptions({});
        (options as unknown as { [property]: unknown })[property] = undefined;

        const result = pagination.buildPaginatedArgs({ args, options });

        expect(result).toEqual({
          ...args,
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
          take: options.take,
        });
      },
    );

    it('should handle when args is undefined', () => {
      const options = mockCursorPaginationOptions({});

      const result = pagination.buildPaginatedArgs({ options });

      expect(result).toEqual({
        cursor: {
          createdAt: options.createdAt,
          id: options.id,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        skip: 1,
        take: options.take,
      });
    });
  });
});
