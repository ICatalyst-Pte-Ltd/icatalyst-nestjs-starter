import { mockCursorPaginationOptions } from '../entities/cursor-pagination.options.entity.utils.spec.js';
import { mockOffsetPaginationOptions } from '../entities/offset-pagination.options.entity.utils.spec.js';
import { PaginationOptions } from '../entities/pagination.options.entity.js';
import { pagination } from './pagination.js';

describe(pagination.name, () => {
  it('should return the cursor strategy if the cursor options are defined', () => {
    const cursor = mockCursorPaginationOptions({});

    const result = pagination({ cursor } as PaginationOptions);

    expect(result).toEqual({ name: 'cursor', options: cursor });
  });

  it('should prefer the cursor strategy if both options are defined', () => {
    const cursor = mockCursorPaginationOptions({});
    const offset = mockOffsetPaginationOptions({});

    const result = pagination({ cursor, offset } as PaginationOptions);

    expect(result).toEqual({ name: 'cursor', options: cursor });
  });

  it('should return the offset strategy if only the offset options are defined', () => {
    const offset = mockOffsetPaginationOptions({});

    const result = pagination({ offset } as PaginationOptions);

    expect(result).toEqual({ name: 'offset', options: offset });
  });

  it('should return undefined if no options are defined', () => {
    const result = pagination({} as PaginationOptions);

    expect(result).toBeUndefined();
  });
});
