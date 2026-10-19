import { randomInt } from 'node:crypto';
import { OffsetPaginationOptions } from './offset-pagination.options.entity.js';

export function mockOffsetPaginationOptions({
  skip = randomInt(1000),
  take = randomInt(1000),
}: Partial<OffsetPaginationOptions>): OffsetPaginationOptions {
  return { skip, take };
}
