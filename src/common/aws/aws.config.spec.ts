import { configTests } from '../testing/config-tests.utils.spec.js';
import { AWSConfig } from './aws.config.js';
import {
  REGEX_ACCESS_KEY_ID,
  REGEX_SECRET_ACCESS_KEY,
} from './aws.constants.js';

configTests(
  AWSConfig,
  {
    AWS_ACCESS_KEY_ID: 'AKIAIOSFODNN7EXAMPLE',
    AWS_SECRET_ACCESS_KEY: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    AWS_REGION: 'ap-southeast-1',
  },
  {
    accessKeyID: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region: 'ap-southeast-1',
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
            description: 'does not match pattern',
            expected: {
              message: (value) =>
                `with value "${value}" fails to match the required pattern: ${REGEX_ACCESS_KEY_ID}`,
            },
            value: 'abcdef',
          },
        ],
      },
      property: 'accessKeyID',
      variable: 'AWS_ACCESS_KEY_ID',
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
            description: 'does not match pattern',
            expected: {
              message: (value) =>
                `with value "${value}" fails to match the required pattern: ${REGEX_SECRET_ACCESS_KEY}`,
            },
            value: 'abc+123',
          },
        ],
      },
      property: 'secretAccessKey',
      variable: 'AWS_SECRET_ACCESS_KEY',
    },
    {
      cases: {
        error: [
          {
            description: 'is blank',
            expected: { message: 'is not allowed to be empty' },
            value: '',
          },
        ],
      },
      property: 'region',
      variable: 'AWS_REGION',
    },
  ],
);
