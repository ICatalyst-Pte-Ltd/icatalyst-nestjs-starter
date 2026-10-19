import { Prisma } from '~prisma/client.js';

export function mockPrismaClientKnownRequestError(
  code: string,
): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError(
    'PrismaClientKnownRequestError',
    {
      clientVersion: 'clientVersion',
      code,
    },
  );
}
