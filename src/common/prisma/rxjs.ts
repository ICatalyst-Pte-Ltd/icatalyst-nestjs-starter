import {
  ConflictException,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '~prisma/client.js';
import { OperatorFunction, catchError } from 'rxjs';
import { ErrorCodes, isErrorCode } from './utilities.js';

type ErrorFactory = (
  error: Prisma.PrismaClientKnownRequestError,
) => HttpException;

type ErrorFactories = {
  [key in ErrorCodes]: ErrorFactory;
};

const defaultFactories: ErrorFactories = {
  [`${ErrorCodes.P2002}`]: (error) =>
    new ConflictException(`Unique constraint violation: ${error.meta?.target}`),
  [`${ErrorCodes.P2017}`]: () => new NotFoundException(),
  [`${ErrorCodes.P2025}`]: () => new NotFoundException(),
};

/**
 * Returns a RxJS {@link OperatorFunction} that converts
 * Prisma-specific errors such as {@link Prisma.PrismaClientKnownRequestError}
 * to the corresponding NestJS {@link HttpException}.
 *
 * @param overrideFactories a map of Prisma error codes to a factories that generate the exception.
 * @param logger the logger for logging unknown errors.
 * @returns a RxJS operator function that converts Prisma-specific errors to
 * NestJS HttpExceptions.
 */
export function handlePrismaErrors<T>(
  overrideFactories: Partial<ErrorFactories>,
  logger: Logger,
): OperatorFunction<T, T> {
  const factories = { ...defaultFactories, ...overrideFactories };
  return catchError((error) => {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      isErrorCode(error.code)
    ) {
      const factory = factories[error.code];
      if (factory != undefined) {
        throw factory(error);
      }
    }
    logger.error({ method: handlePrismaErrors.name, error });
    throw error;
  });
}
