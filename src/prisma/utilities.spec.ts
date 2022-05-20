import { Prisma } from '@prisma/client';
import {
  isRecordNotFoundError,
  isUniqueConstraintViolation,
} from './utilities';

describe.each([
  { code: 'P2002', fn: isUniqueConstraintViolation },
  { code: 'P2025', fn: isRecordNotFoundError },
])('$#: $fn.name', ({ code, fn }) => {
  it.each([
    {
      error: new Prisma.PrismaClientKnownRequestError(
        'PrismaClientKnownRequestError',
        { clientVersion: 'clientVersion', code },
      ),
      expected: true,
      text: `and code is ${code}`,
    },
    {
      error: new Prisma.PrismaClientKnownRequestError(
        'PrismaClientKnownRequestError',
        { clientVersion: 'clientVersion', code: 'other' },
      ),
      expected: false,
      text: 'and code is other',
    },
    {
      error: new Error('Error'),
      expected: false,
      text: '',
    },
  ])(
    '$#: should be $expected if error is $error.constructor.name $text',
    ({ error, expected }) => {
      const result = fn(error);

      expect(result).toBe(expected);
    },
  );
});
