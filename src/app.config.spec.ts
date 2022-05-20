import { AppConfig } from './app.config';

describe(`${AppConfig.name}`, () => {
  const env = { ...process.env };

  const regExp = /^-[a-zA-Z\d+/]{12}$/g;

  beforeEach(() => {
    process.env = { ...env };
  });

  it('should read from environment variables', () => {
    process.env.APP_NAME = 'name';

    const config = new AppConfig();

    expect(config.name).toBe('name');
  });

  it('should use a default name if APP_NAME is undefined', () => {
    const config = new AppConfig();

    expect(config.name).toMatch(regExp);
  });
});
