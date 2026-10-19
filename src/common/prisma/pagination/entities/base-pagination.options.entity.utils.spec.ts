import { randomInt } from 'node:crypto';
import { BasePaginationOptions } from './base-pagination.options.entity.js';

export function mockBasePaginationOptions({
  take = randomInt(1000),
}: Partial<BasePaginationOptions>): BasePaginationOptions {
  return { take };
}
