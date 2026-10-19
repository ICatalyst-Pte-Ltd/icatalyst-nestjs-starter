import {
  entityTests,
  isInt,
  isUuid,
  nestedValidation,
} from '../../../testing/entity-tests.utils.spec.js';
import { mockCursorPaginationOptions } from './cursor-pagination.options.entity.utils.spec.js';
import { mockOffsetPaginationOptions } from './offset-pagination.options.entity.utils.spec.js';
import { PaginationOptions } from './pagination.options.entity.js';
import { mockPaginationOptions } from './pagination.options.entity.utils.spec.js';

entityTests(PaginationOptions, mockPaginationOptions, {
  nested: [
    {
      expected: {
        children: [{ constraints: { isUuid: isUuid('id') } }],
      },
      property: 'cursor',
      value: mockCursorPaginationOptions({ id: '' }),
    },
    {
      expected: { children: [{ constraints: { isInt: isInt('skip') } }] },
      property: 'offset',
      value: mockOffsetPaginationOptions({ skip: 1.1 }),
    },
  ],
  transform: [
    {
      expected: {
        createdAt: new Date('2025-06-26T03:48:46.688Z'),
        id: 'id',
        take: 1,
      },
      property: 'cursor',
      value: mockCursorPaginationOptions({
        createdAt: new Date('2025-06-26T03:48:46.688Z'),
        id: 'id',
        take: 1,
      }),
    },
    {
      expected: { skip: 1, take: 2 },
      property: 'offset',
      value: mockOffsetPaginationOptions({ skip: 1, take: 2 }),
    },
  ],
  validation: [
    {
      cases: [
        {
          description: 'is a blank string',
          expected: { nestedValidation },
          value: '',
        },
      ],
      property: 'cursor',
    },
    {
      cases: [
        {
          description: 'is a blank string',
          expected: { nestedValidation },
          value: '',
        },
      ],
      property: 'offset',
    },
  ],
});
