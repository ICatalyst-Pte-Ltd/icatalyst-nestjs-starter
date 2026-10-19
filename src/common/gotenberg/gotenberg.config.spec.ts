import { configTests } from '../testing/config-tests.utils.spec.js';
import { GotenbergConfig } from './gotenberg.config.js';

configTests(
  GotenbergConfig,
  { GOTENBERG_URL: 'http://localhost:4000' },
  { url: 'http://localhost:4000' },
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
            description: 'is not an http(s) url',
            expected: {
              message:
                'must be a valid uri with a scheme matching the https? pattern',
            },
            value: 'ftp://localhost:4000',
          },
        ],
      },
      property: 'url',
      variable: 'GOTENBERG_URL',
    },
  ],
);
