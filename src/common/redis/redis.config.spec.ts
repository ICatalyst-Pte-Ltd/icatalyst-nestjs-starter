import { RedisConfig } from './redis.config.js';
import { configTests } from '../testing/config-tests.utils.spec.js';

configTests(
  RedisConfig,
  {
    REDIS_HOST: 'example.com',
    REDIS_PORT: '6379',
  },
  {
    host: 'example.com',
    port: 6379,
    url: 'redis://example.com:6379',
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
        ],
        good: [
          { expected: 'localhost', value: undefined },
          { expected: 'localhost', value: 'localhost' },
          { expected: 'redis', value: 'redis' },
        ],
      },
      property: 'host',
      variable: 'REDIS_HOST',
    },
    {
      cases: {
        error: [
          {
            description: 'is blank',
            expected: { message: 'must be a number' },
            value: '',
          },
          {
            description: 'not an integer',
            expected: { message: 'must be an integer' },
            value: '1.1',
          },
          {
            description: 'not positive',
            expected: { message: 'must be a positive number' },
            value: '0',
          },
        ],
        good: [
          {
            expected: 6379,
            value: undefined,
          },
        ],
      },
      property: 'port',
      variable: 'REDIS_PORT',
    },
  ],
);
