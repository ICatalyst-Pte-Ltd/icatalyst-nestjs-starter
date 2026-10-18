import { INestApplication, Logger } from '@nestjs/common';
import { initializeApp } from './initialize-app.js';

const mocks = vi.hoisted(() => ({
  enableSecurity: vi.fn(),
  enableSwagger: vi.fn(),
  enableVersioning: vi.fn(),
  setupClassValidator: vi.fn(),
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
  let app: INestApplication;

  beforeEach(() => {
    app = {} as INestApplication;
    vi.clearAllMocks();
  });

  it('should call the respective functions with provided logger', () => {
    const logger = { log: vi.fn() } as unknown as Logger;

    const result = initializeApp(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toBeCalledWith('Initializing application');
    expect(mocks.enableSecurity).toBeCalledWith(app, logger);
    expect(mocks.enableVersioning).toBeCalledWith(app, logger);
    expect(mocks.enableSwagger).toBeCalledWith(app, logger);
    expect(mocks.setupClassValidator).toBeCalledWith(app, logger);
  });

  it('should call the respective functions with the default logger', () => {
    Logger.prototype.log = vi.fn();

    const result = initializeApp(app);

    expect(result).toBe(app);

    expect(Logger.prototype.log).toBeCalledWith('Initializing application');
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
  });
});
