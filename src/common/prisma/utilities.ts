import { Prisma } from '~prisma/client.js';

const P2002 = 'P2002';
const P2017 = 'P2017';
const P2025 = 'P2025';

/**
 * @see https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export enum ErrorCodes {
  /**
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
   */
  P2002 = 'P2002',
  /**
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#p2017
   */
  P2017 = 'P2017',
  /**
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
   */
  P2025 = 'P2025',
}

export type ErrorCode = keyof typeof ErrorCodes;

export function isErrorCode(code: string): code is ErrorCode {
  return code in ErrorCodes;
}

export function isUniqueConstraintViolation(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError & { code: typeof P2002 } {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === P2002
  );
}

export function isRecordNotFoundError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError & {
  code: typeof P2017 | typeof P2025;
} {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === P2017 || error.code === P2025)
  );
}
