import { INestApplication, Logger } from '@nestjs/common';
import * as security from './security';
import { initializeApp } from './initialize-app';
import * as swagger from './swagger';
import * as versioning from './versioning';

describe(initializeApp.name, () => {
  let app: INestApplication;

  beforeEach(() => {
    app = {} as INestApplication;
    jest.spyOn(security, 'enableSecurity').mockImplementation();
    jest.spyOn(versioning, 'enableVersioning').mockImplementation();
    jest.spyOn(swagger, 'enableSwagger').mockImplementation();
  });

  it('should call the respective functions with provided logger', () => {
    const logger = { log: jest.fn() } as unknown as Logger;

    const result = initializeApp(app, logger);

    expect(result).toBe(app);

    expect(logger.log).toBeCalledWith('Initializing application');
    expect(security.enableSecurity).toBeCalledWith(app, logger);
    expect(versioning.enableVersioning).toBeCalledWith(app, logger);
    expect(swagger.enableSwagger).toBeCalledWith(app, logger);
  });

  it('should call the respective functions with the default logger', () => {
    Logger.prototype.log = jest.fn();

    const result = initializeApp(app);

    expect(result).toBe(app);

    expect(Logger.prototype.log).toBeCalledWith('Initializing application');
    expect(security.enableSecurity).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
    expect(swagger.enableSwagger).toBeCalledWith(
      app,
      expect.objectContaining({ context: 'Initialization' }),
    );
  });
});
