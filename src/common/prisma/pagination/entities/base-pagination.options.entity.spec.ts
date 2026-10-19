import {
  entityTests,
  isInt,
  isNumber,
  isPositive,
} from '../../../testing/entity-tests.utils.spec.js';
import { BasePaginationOptions } from './base-pagination.options.entity.js';
import { mockBasePaginationOptions } from './base-pagination.options.entity.utils.spec.js';

entityTests(BasePaginationOptions, mockBasePaginationOptions, {
  transform: [{ expected: 1, property: 'take', value: '1' }],
  validation: [
    {
      cases: [
        {
          description: 'is not a number',
          expected: {
            isInt,
            isNumber,
            isPositive,
          },
          value: 'a',
        },
        {
          description: 'is a negative number',
          expected: { isPositive },
          value: '-1',
        },
        {
          description: 'is not an integer',
          expected: { isInt },
          value: '1.1',
        },
      ],
      property: 'take',
    },
  ],
});
