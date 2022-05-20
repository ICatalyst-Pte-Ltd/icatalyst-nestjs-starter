import { Prisma } from '@prisma/client';

const P2002 = 'P2002';
const P2025 = 'P2025';

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
