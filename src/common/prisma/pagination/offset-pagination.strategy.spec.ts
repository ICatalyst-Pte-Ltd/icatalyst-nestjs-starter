import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { mockOffsetPaginationOptions } from './entities/offset-pagination.options.entity.utils.spec.js';
import { OffsetPaginationStrategy } from './offset-pagination.strategy.js';

describe(OffsetPaginationStrategy.name, () => {
  let pagination: OffsetPaginationStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffsetPaginationStrategy],
    }).compile();

    pagination = module.get(OffsetPaginationStrategy);
  });

  it('should be defined', () => {
    expect(pagination).toBeDefined();
    expect(pagination.name).toBe('offset');
  });

  describe(OffsetPaginationStrategy.prototype.buildPaginatedArgs.name, () => {
    it('should a new instance of args with the right properties added', () => {
      const args = { where: { id: randomUUID() } };
      const options = mockOffsetPaginationOptions({});

      const result = pagination.buildPaginatedArgs({ args, options });

      expect(result).toEqual({
        ...args,
        skip: options.skip,
        take: options.take,
      });
      expect(result).not.toBe(args);
    });

    it('should set skip to 0 if it is undefined', () => {
      const args = { where: { id: randomUUID() } };
      const options = mockOffsetPaginationOptions({});
      (options as { skip?: number }).skip = undefined;

      const result = pagination.buildPaginatedArgs({ args, options });

      expect(result).toEqual({
        ...args,
        skip: 0,
        take: options.take,
      });
    });

    it('should handle when args is undefined', () => {
      const options = mockOffsetPaginationOptions({});

      const result = pagination.buildPaginatedArgs({ options });

      expect(result).toEqual({
        skip: options.skip,
        take: options.take,
      });
    });
  });
});
