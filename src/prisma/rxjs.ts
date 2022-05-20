import { HttpException, Logger } from '@nestjs/common';
import { OperatorFunction, catchError } from 'rxjs';
import { isRecordNotFoundError } from './utilities';

type ErrorFactory = () => HttpException;

/**
 * Returns a RxJS {@link OperatorFunction} that converts
 * Prisma-specific errors such as {@link Prisma.PrismaClientKnownRequestError}
 * to the corresponding NestJS {@link HttpException}.
 *
 * @param factory the factory to generate the exception
 * @param logger the logger for logging unknown errors
 * @returns a RxJS operator function that converts Prisma-specific errors to
 * NestJS HttpExceptions
 */
export function handlePrismaErrors<T>(
  factory: ErrorFactory,
  logger: Logger,
): OperatorFunction<T, T> {
  return catchError((error) => {
    if (isRecordNotFoundError(error)) {
      throw factory();
    }
    logger.error({ method: handlePrismaErrors.name, error });
    throw error;
  });
}
