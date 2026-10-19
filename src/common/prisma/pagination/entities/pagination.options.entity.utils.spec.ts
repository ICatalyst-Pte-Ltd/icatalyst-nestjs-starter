import { mockCursorPaginationOptions } from './cursor-pagination.options.entity.utils.spec.js';
import { mockOffsetPaginationOptions } from './offset-pagination.options.entity.utils.spec.js';
import { PaginationOptions } from './pagination.options.entity.js';

export function mockPaginationOptions({
  cursor = mockCursorPaginationOptions({}),
  offset = mockOffsetPaginationOptions({}),
}: Partial<PaginationOptions>): PaginationOptions {
  return { cursor, offset };
}
