import { configTests } from '../testing/config-tests.utils.spec.js';
import { PrismaConfig } from './prisma.config.js';

configTests(
  PrismaConfig,
  {
    DATABASE_URL:
      'postgresql://nestjs:password@localhost:5432/nestjs?schema=public',
  },
  {
    url: 'postgresql://nestjs:password@localhost:5432/nestjs?schema=public',
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
            description: 'is not a postgres url',
            expected: {
              message:
                'must be a valid uri with a scheme matching the postgres(ql)? pattern',
            },
            value: 'redis://localhost:6379',
          },
        ],
      },
      property: 'url',
      variable: 'DATABASE_URL',
    },
  ],
);
