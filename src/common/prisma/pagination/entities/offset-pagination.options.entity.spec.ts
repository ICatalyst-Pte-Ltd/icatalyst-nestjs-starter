import {
  entityTests,
  isInt,
  isNumber,
  min,
} from '../../../testing/entity-tests.utils.spec.js';
import { OffsetPaginationOptions } from './offset-pagination.options.entity.js';
import { mockOffsetPaginationOptions } from './offset-pagination.options.entity.utils.spec.js';

entityTests(OffsetPaginationOptions, mockOffsetPaginationOptions, {
  transform: [{ expected: 1, property: 'skip', value: '1' }],
  validation: [
    {
      cases: [
        {
          description: 'is not a number',
          expected: {
            isInt,
            isNumber,
            min: min(0),
          },
          value: 'a',
        },
        {
          description: 'is a negative number',
          expected: { min: min(0) },
          value: '-1',
        },
        {
          description: 'is not an integer',
          expected: { isInt },
          value: '1.1',
        },
      ],
      property: 'skip',
    },
  ],
});
