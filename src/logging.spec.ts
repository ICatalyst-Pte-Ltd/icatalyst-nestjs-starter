import { getLogLevels } from './logging';

describe('logging', () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env = { ...env };
  });

  it('should use the APP_LOG_LEVEL if available', () => {
    process.env.APP_LOG_LEVEL = 'warn';

    const result = getLogLevels();

    expect(result).toEqual(['warn']);
  });

  it('should return the "log" level if NODE_ENV is production and APP_LOG_LEVEL is not available', () => {
    process.env.NODE_ENV = 'production';

    const result = getLogLevels();

    expect(result).toEqual(['log']);
  });

  it('should return the "debug" level if NODE_ENV is not production and APP_LOG_LEVEL is not available', () => {
    process.env.NODE_ENV = 'development';

    const result = getLogLevels();

    expect(result).toEqual(['debug']);
  });
});
