import { Prisma } from '@prisma/client';

const P2002 = 'P2002';
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
): error is Prisma.PrismaClientKnownRequestError & { code: typeof P2025 } {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === P2025
  );
}
