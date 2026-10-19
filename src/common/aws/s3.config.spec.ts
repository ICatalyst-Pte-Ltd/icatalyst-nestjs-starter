import { configTests } from '../testing/config-tests.utils.spec.js';
import { S3Config } from './s3.config.js';
import { DEFAULT_CUSTOM_DOMAIN } from './s3.constants.js';

configTests(
  S3Config,
  {
    AWS_S3_BUCKET_NAME: 'storageName',
    AWS_S3_LOCATION: 'public',
    AWS_S3_CUSTOM_DOMAIN: '',
    AWS_S3_FORCE_PATH_STYLE: 'true',
  },
  {
    bucketName: 'storageName',
    location: 'public',
    customDomain: DEFAULT_CUSTOM_DOMAIN,
    forcePathStyle: true,
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
      },
      property: 'bucketName',
      variable: 'AWS_S3_BUCKET_NAME',
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
      property: 'location',
      variable: 'AWS_S3_LOCATION',
    },
    {
      cases: {
        good: [
          { expected: DEFAULT_CUSTOM_DOMAIN, value: undefined },
          { expected: DEFAULT_CUSTOM_DOMAIN, value: '' },
        ],
      },
      property: 'customDomain',
      variable: 'AWS_S3_CUSTOM_DOMAIN',
    },
    {
      cases: {
        error: [
          {
            description: 'is not a boolean',
            expected: { message: 'must be a boolean' },
            value: 'maybe',
          },
        ],
        good: [
          { expected: false, value: undefined },
          { expected: false, value: '' },
          { expected: false, value: 'false' },
        ],
      },
      property: 'forcePathStyle',
      variable: 'AWS_S3_FORCE_PATH_STYLE',
    },
  ],
);
