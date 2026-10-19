import { MissingEnvironmentVariableError } from './missing-environment-variable.error.js';

describe(MissingEnvironmentVariableError.name, () => {
  it('should include the name of the environment variable in the message', () => {
    const result = new MissingEnvironmentVariableError('SOME_VARIABLE');

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(
      "The 'SOME_VARIABLE' environment variable is undefined",
    );
  });
});
