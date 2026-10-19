import { PaginationOptions } from '../entities/pagination.options.entity.js';
import { PaginationStrategyConfig } from '../pagination.types.js';

export function pagination({
  cursor,
  offset,
}: PaginationOptions): PaginationStrategyConfig | undefined {
  return cursor
    ? {
        name: 'cursor',
        options: cursor,
      }
    : offset
      ? {
          name: 'offset',
          options: offset,
        }
      : undefined;
}
