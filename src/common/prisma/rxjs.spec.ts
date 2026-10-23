import {
  ConflictException,
  ImATeapotException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '~prisma';
import { firstValueFrom, throwError } from 'rxjs';
import { handlePrismaErrors } from './rxjs.js';

describe(handlePrismaErrors.name, () => {
  let logger: Logger;

  beforeEach(() => {
    logger = {} as Logger;
  });

  it.each([
    {
      code: 'P2002',
      ExpectedError: ConflictException,
    },
    {
      code: 'P2017',
      ExpectedError: NotFoundException,
    },
    {
      code: 'P2025',
      ExpectedError: NotFoundException,
    },
  ])(
    '$#: should use the default exception $ExpectedError.name for code $code',
    async ({ code, ExpectedError }) => {
      const error = new Prisma.PrismaClientKnownRequestError('message', {
        clientVersion: 'clientVersion',
        code,
      });

      const observable = throwError(() => error).pipe(
        handlePrismaErrors({}, logger),
      );

      await expect(firstValueFrom(observable)).rejects.toBeInstanceOf(
        ExpectedError,
      );
    },
  );

  it.each([
    { code: 'P2002', error: new ImATeapotException() },
    { code: 'P2017', error: new ImATeapotException() },
    { code: 'P2025', error: new ImATeapotException() },
  ])(
    '$#: should replace the Prisma error (code = $code) with the $error.name',
    async ({ code, error }) => {
      const thrownError = new Prisma.PrismaClientKnownRequestError('message', {
        clientVersion: 'clientVersion',
        code,
      });

      const observable = throwError(() => thrownError).pipe(
        handlePrismaErrors({ [code]: () => error }, logger),
      );

      await expect(firstValueFrom(observable)).rejects.toBeInstanceOf(
        ImATeapotException,
      );
    },
  );

  it('should rethrow the Prisma error if the factory is removed', async () => {
    const loggerError = vi.fn();
    logger.error = loggerError;
    const error = new Prisma.PrismaClientKnownRequestError('message', {
      clientVersion: 'clientVersion',
      code: 'P2002',
    });

    const observable = throwError(() => error).pipe(
      handlePrismaErrors({ P2002: undefined }, logger),
    );

    await expect(firstValueFrom(observable)).rejects.toBe(error);
    expect(loggerError).toHaveBeenCalledWith({
      method: handlePrismaErrors.name,
      error,
    });
  });

  it('should handle unknown errors', async () => {
    const loggerError = vi.fn();
    logger.error = loggerError;
    const unknownError = new Error('unknown');

    const observable = throwError(() => unknownError).pipe(
      handlePrismaErrors({}, logger),
    );

    await expect(firstValueFrom(observable)).rejects.toBe(unknownError);
    expect(loggerError).toHaveBeenCalledTimes(1);
    expect(loggerError).toHaveBeenCalledWith({
      method: handlePrismaErrors.name,
      error: unknownError,
    });
  });
});
