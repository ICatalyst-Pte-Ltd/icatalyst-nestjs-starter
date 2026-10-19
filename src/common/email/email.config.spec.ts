import { configTests } from '../testing/config-tests.utils.spec.js';
import { EmailConfig } from './email.config.js';

configTests(
  EmailConfig,
  {
    EMAIL_FROM: 'test@example.com',
  },
  {
    fromEmail: 'test@example.com',
  },
  [
    {
      cases: {
        error: [
          {
            description: 'is blank',
            expected: { message: 'is not allowed to be empty' },
            value: '',
          },
          {
            description: 'key does not follow regex',
            expected: { message: 'must be a valid email' },
            value: 'test@ex@',
          },
        ],
      },
      property: 'fromEmail',
      variable: 'EMAIL_FROM',
    },
  ],
);
