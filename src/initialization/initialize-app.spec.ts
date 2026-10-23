import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { initializeApp } from './initialize-app.js';

const mocks = vi.hoisted(() => ({
  enableSecurity: vi.fn(),
  enableSwagger: vi.fn(),
  enableVersioning: vi.fn(),
  initializeJsonParser: vi.fn(),
  setupClassValidator: vi.fn(),
}));

vi.mock('./body-parser.js', () => ({
  initializeJsonParser: mocks.initializeJsonParser,
}));
vi.mock('./class-validator.js', () => ({
  setupClassValidator: mocks.setupClassValidator,
}));
vi.mock('./security/index.js', () => ({
  enableSecurity: mocks.enableSecurity,
}));
vi.mock('./swagger.js', () => ({
  enableSwagger: mocks.enableSwagger,
}));
vi.mock('./versioning.js', () => ({
  enableVersioning: mocks.enableVersioning,
}));

describe(initializeApp.name, () => {
  let app: NestExpressApplication;

  beforeEach(() => {
    app = {} as NestExpressApplication;
    vi.clearAllMocks();
  });

  it('should call the respective functions with provided logger', () => {
    const log = vi.fn();
    const logger = { log } as unknown as Logger;

    const result = initializeApp(app, logger);

    expect(result).toBe(app);
    expect(log).toBeCalledWith('Initializing application');
    expect(mocks.enableSecurity).toBeCalledWith(app, logger);
    expect(mocks.enableVersioning).toBeCalledWith(app, logger);
    expect(mocks.enableSwagger).toBeCalledWith(app, logger);
    expect(mocks.setupClassValidator).toBeCalledWith(app, logger);
    expect(mocks.initializeJsonParser).toBeCalledWith(app, logger);
  });

  it('should call the respective functions with the default logger', () => {
    const log = vi.fn();
    Logger.prototype.log = log;

    const result = initializeApp(app);

    expect(result).toBe(app);

    expect(log).toBeCalledWith('Initializing application');
    expect(mocks.enableSecurity).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
    expect(mocks.enableSwagger).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
    expect(mocks.setupClassValidator).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
    expect(mocks.initializeJsonParser).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
  });
});
