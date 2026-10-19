import {
  entityTests,
  isDate,
  isUuid,
} from '../../../testing/entity-tests.utils.spec.js';
import { CursorPaginationOptions } from './cursor-pagination.options.entity.js';
import { mockCursorPaginationOptions } from './cursor-pagination.options.entity.utils.spec.js';

entityTests(CursorPaginationOptions, mockCursorPaginationOptions, {
  transform: [
    {
      expected: new Date('1970-01-01T00:00:00.001Z'),
      property: 'createdAt',
      value: 1,
    },
  ],
  validation: [
    {
      cases: [
        {
          description: 'is a blank string',
          expected: { isDate },
          value: '',
        },
      ],
      property: 'createdAt',
    },
    {
      cases: [
        {
          description: 'is a blank string',
          expected: { isUuid },
          value: '',
        },
      ],
      property: 'id',
    },
  ],
});
