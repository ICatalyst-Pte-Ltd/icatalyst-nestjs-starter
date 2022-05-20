import { AppConfig } from './app.config';

describe(`${AppConfig.name}`, () => {
  const env = { ...process.env };

  const regExp = /^app-[a-zA-Z\d+/]{12}$/g;

  beforeEach(() => {
    process.env = {
      ...env,
      APP_NAME: 'name',
      APP_URL: 'https://localhost:3000',
    };
  });

  it('should read from environment variables', () => {
    const config = new AppConfig();

    expect(config.name).toBe('name');
    expect(config.url).toBe('https://localhost:3000');
  });

  it('should use a default name if APP_NAME is undefined', () => {
    delete process.env.APP_NAME;

    const config = new AppConfig();

    expect(config.name).toMatch(regExp);
  });

  it('should throw an error if APP_URL is undefined', () => {
    delete process.env.APP_URL;

    expect(() => new AppConfig()).toThrow(
      "The 'APP_URL' environment variable is undefined",
    );
  });
});
