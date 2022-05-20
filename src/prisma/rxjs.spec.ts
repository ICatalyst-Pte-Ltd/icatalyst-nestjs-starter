import {
  BadRequestException,
  ImATeapotException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { throwError } from 'rxjs';
import { observer } from '../common/test.spec';
import { handlePrismaErrors } from './rxjs';

describe(handlePrismaErrors.name, () => {
  let logger: Logger;

  beforeEach(() => {
    logger = {} as Logger;
  });

  it.each([
    {
      code: 'P2002',
      ExpectedError: BadRequestException,
    },
    {
      code: 'P2025',
      ExpectedError: NotFoundException,
    },
  ])(
    '$#: should use the default exception $ExpectedError.name for code $code',
    ({ code, ExpectedError }, done) => {
      const error = new Prisma.PrismaClientKnownRequestError('message', {
        clientVersion: 'clientVersion',
        code,
      });

      const observable = throwError(() => error).pipe(
        handlePrismaErrors({}, logger),
      );

      observable.subscribe(
        observer({
          error(error) {
            try {
              expect(error).toBeInstanceOf(ExpectedError);
              done();
            } catch (error) {
              done(error);
            }
          },
        }),
      );
    },
  );

  it.each([
    { code: 'P2002', error: new ImATeapotException() },
    { code: 'P2025', error: new ImATeapotException() },
  ])(
    '$#: should replace the Prisma error (code = $code) with the $error.name',
    ({ code, error }, done) => {
      const thrownError = new Prisma.PrismaClientKnownRequestError('message', {
        clientVersion: 'clientVersion',
        code,
      });

      const observable = throwError(() => thrownError).pipe(
        handlePrismaErrors({ [code]: () => error }, logger),
      );

      observable.subscribe(
        observer({
          error(error) {
            try {
              expect(error).toBeInstanceOf(ImATeapotException);
              done();
            } catch (error) {
              done(error);
            }
          },
        }),
      );
    },
  );

  it('should handle unknown errors', (done) => {
    logger.error = jest.fn();
    const unknownError = new Error('unknown');

    const observable = throwError(() => unknownError).pipe(
      handlePrismaErrors({}, logger),
    );

    observable.subscribe(
      observer({
        error(error) {
          try {
            expect(error).toBe(unknownError);
            expect(logger.error).toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith({
              method: handlePrismaErrors.name,
              error: unknownError,
            });
            done();
          } catch (error) {
            done(error);
          }
        },
      }),
    );
  });
});
