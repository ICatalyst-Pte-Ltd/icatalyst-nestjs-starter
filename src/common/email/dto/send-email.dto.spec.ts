import { entityTests } from '../../testing/entity-tests.utils.spec.js';
import { SendEmailDto } from './send-email.dto.js';
import { sendEmailDto } from './send-email.dto.utils.spec.js';

entityTests(SendEmailDto, sendEmailDto, {
  validation: [
    {
      cases: [
        {
          description: 'is not a string',
          expected: {
            isString: 'must be a string',
          },
          value: 1,
        },
      ],
      property: 'to',
    },
    {
      cases: [
        {
          description: 'is not a string',
          expected: {
            isString: 'must be a string',
          },
          value: 1,
        },
      ],
      property: 'subject',
    },
    {
      cases: [
        {
          description: 'is not a string',
          expected: {
            isString: 'must be a string',
          },
          value: 1,
        },
      ],
      property: 'text',
    },
    {
      cases: [
        {
          description: 'is not a string',
          expected: {
            isString: 'must be a string',
          },
          value: 1,
        },
      ],
      property: 'html',
    },
  ],
});
