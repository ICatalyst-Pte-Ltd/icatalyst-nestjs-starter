import { AppConfig } from './app.config.js';
import { configTests } from './common/testing/config-tests.utils.spec.js';

configTests(
  AppConfig,
  {
    APP_NAME: 'name',
    APP_PORT: '8080',
    APP_URL: 'https://localhost:3000',
  },
  {
    name: 'name',
    port: 8080,
    url: 'https://localhost:3000',
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
            description: 'not a valid url',
            expected: {
              message:
                'must be a valid uri with a scheme matching the https? pattern',
            },
            value: 'notValid',
          },
        ],
      },
      property: 'url',
      variable: 'APP_URL',
    },
    {
      cases: {
        good: [
          { expected: /^app-[a-zA-Z\d+/]{12}$/g, value: undefined },
          { expected: /^app-[a-zA-Z\d+/]{12}$/g, value: '' },
        ],
      },
      property: 'name',
      variable: 'APP_NAME',
    },
    {
      cases: {
        error: [
          {
            description: 'is not a number',
            expected: { message: 'must be a number' },
            value: 'abc',
          },
          {
            description: 'is not a valid port',
            expected: { message: 'must be a valid port' },
            value: '70000',
          },
        ],
        good: [
          { expected: 3000, value: undefined },
          { expected: 3000, value: '' },
          { expected: 4000, value: '4000' },
        ],
      },
      property: 'port',
      variable: 'APP_PORT',
    },
  ],
);
