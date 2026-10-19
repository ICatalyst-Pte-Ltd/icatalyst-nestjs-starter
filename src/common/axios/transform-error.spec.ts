import { transformError } from './transform-error.js';

describe(transformError.name, () => {
  it.each([
    {
      error: {
        isAxiosError: true,
        code: 'code',
        message: 'message',
        response: { status: 200, statusText: 'Ok' },
      },
      expected: {
        code: 'code',
        message: 'message',
        statusCode: 200,
        statusText: 'Ok',
      },
      text: 'is Axios error',
    },
    { error: {}, expected: {}, text: 'is not Axios error' },
  ])('should transform correctly when error $text', ({ error, expected }) => {
    const result = transformError(error);

    expect(result).toEqual(expected);
  });
});
