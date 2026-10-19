import { configTests } from '../testing/config-tests.utils.spec.js';
import { ProxyConfig } from './proxy.config.js';

configTests(
  ProxyConfig,
  { APP_OPENAPI_URL: 'https://localhost:9000' },
  { openApiUrl: 'https://localhost:9000' },
  [
    {
      cases: {
        error: [
          {
            description: 'is missing',
            expected: {
              message: 'is required',
            },
            value: undefined,
          },
          {
            description: 'is blank',
            expected: {
              message: 'is not allowed to be empty',
            },
            value: '',
          },
        ],
      },
      property: 'openApiUrl',
      variable: 'APP_OPENAPI_URL',
    },
  ],
);
