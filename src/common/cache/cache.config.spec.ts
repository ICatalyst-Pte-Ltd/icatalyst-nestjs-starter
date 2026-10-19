import { CacheConfig } from './cache.config.js';
import { configTests } from '../testing/config-tests.utils.spec.js';

configTests(
  CacheConfig,
  {
    CACHE_TTL: '1',
    CACHE_URL: 'redis://example.com:6379',
  },
  {
    ttl: 1,
    url: 'redis://example.com:6379',
  },
  [
    {
      cases: {
        error: [
          {
            description: 'is string',
            expected: { message: 'must be a number' },
            value: '',
          },
          {
            description: 'is not an integer',
            expected: { message: 'must be an integer' },
            value: '1.1',
          },
          {
            description: 'is not a positive number',
            expected: { message: 'must be a positive number' },
            value: '0',
          },
        ],
      },
      property: 'ttl',
      variable: 'CACHE_TTL',
    },
    {
      cases: {
        error: [
          {
            description: 'is blank',
            expected: { message: 'is not allowed to be empty' },
            value: '',
          },
          {
            description: 'is not url',
            expected: {
              message:
                'must be a valid uri with a scheme matching the rediss? pattern',
            },
            value: 'not url',
          },
        ],
      },
      property: 'url',
      variable: 'CACHE_URL',
    },
    {
      cases: {
        good: [{ expected: undefined, value: undefined }],
      },
      property: 'ttl',
      variable: 'CACHE_TTL',
    },
  ],
);
