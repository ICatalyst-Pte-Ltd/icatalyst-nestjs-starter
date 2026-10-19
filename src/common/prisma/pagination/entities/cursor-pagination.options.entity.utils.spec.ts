import { randomInt, randomUUID } from 'node:crypto';
import { CursorPaginationOptions } from './cursor-pagination.options.entity.js';

export function mockCursorPaginationOptions({
  createdAt = new Date(),
  id = randomUUID(),
  take = randomInt(1000),
}: Partial<CursorPaginationOptions>): CursorPaginationOptions {
  return { createdAt, id, take };
}
