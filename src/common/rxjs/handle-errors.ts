import { Logger } from '@nestjs/common';
import { catchError, of, OperatorFunction } from 'rxjs';

export function handleErrors<T, A extends Array<unknown>, R>(
  logger: Logger,
  method: (...args: A) => R,
  message: string,
  fallbackValue?: T, // Optional fallback value
): OperatorFunction<T, T | undefined> {
  return catchError((error) => {
    logger.warn({
      method: method.name,
      message: message,
      error: {
        code: error.code,
        data: error.response?.data,
        message: error.message,
        name: error.name,
      },
    });
    return of(fallbackValue);
  });
}
