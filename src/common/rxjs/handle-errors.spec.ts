import { firstValueFrom, throwError } from 'rxjs';
import { handleErrors } from './handle-errors.js';
import { Logger } from '@nestjs/common';

describe(handleErrors.name, () => {
  let logger: Logger;

  // Sample methods for testing
  function getData() {}
  function postData() {}

  beforeEach(() => {
    logger = {
      warn: vi.fn(),
    } as unknown as Logger;
  });

  it.each([
    {
      method: getData,
      message: 'Error fetching data',
      expectedFallback: undefined,
    },
    {
      method: postData,
      message: 'Error posting data',
      expectedFallback: 'defaultFallback',
    },
  ])(
    '$#: should log an error and return fallbackValue when error occurs',
    async ({ method, message, expectedFallback }) => {
      const error = {
        code: 'ERR_CODE',
        response: { data: 'some data' },
        message: 'Test error message',
        name: 'TestError',
      };

      const observable = throwError(() => error).pipe(
        handleErrors(logger, method, message, expectedFallback),
      );

      const result = await firstValueFrom(observable);

      expect(result).toBe(expectedFallback);
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith({
        method: method.name,
        message: message,
        error: {
          code: error.code,
          data: error.response?.data,
          message: error.message,
          name: error.name,
        },
      });
    },
  );
});
