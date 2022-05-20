import { Prisma } from '@prisma/client';
import {
  isErrorCode,
  isRecordNotFoundError,
  isUniqueConstraintViolation,
} from './utilities';

describe(isErrorCode.name, () => {
  it.each([
    { code: 'P2002', expected: true },
    { code: 'P2025', expected: true },
    { code: 'other', expected: false },
  ])('$#: should expect code $code to be $expected', ({ code, expected }) => {
    const result = isErrorCode(code);

    expect(result).toBe(expected);
  });
});

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
