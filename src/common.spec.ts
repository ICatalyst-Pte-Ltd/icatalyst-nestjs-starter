import { env } from './common';
import { MissingEnvironmentVariableError } from './errors';

describe('common', () => {
  describe(`${env.name}`, () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    it('should return the value', () => {
      const name = 'SOME_ENVIRONMENT_VARIABLE';
      process.env[name] = 'some value';

      const result = env(name);

      expect(result).toBe('some value');
    });

    it('should throw an error if the environment variable is undefined', () => {
      const name = 'SOME_ENVIRONMENT_VARIABLE';

      function getEnv() {
        env(name);
      }

      expect(getEnv).toThrow(new MissingEnvironmentVariableError(name));
    });

    it('should throw an error if the blank value is not allowed', () => {
      const name = 'SOME_ENVIRONMENT_VARIABLE';
      process.env[name] = '';

      function getEnv() {
        env(name, undefined, true);
      }

      expect(getEnv).toThrow(new MissingEnvironmentVariableError(name));
    });

    it('should use the default value if the environment variable is undefined', () => {
      const name = 'SOME_ENVIRONMENT_VARIABLE';

      const result = env(name, () => 'some default value');

      expect(result).toBe('some default value');
    });

    it('should use the default value if the blank value is not allowed', () => {
      const name = 'SOME_ENVIRONMENT_VARIABLE';
      process.env[name] = '';

      const result = env(name, () => 'some default value', true);

      expect(result).toBe('some default value');
    });
  });
});
