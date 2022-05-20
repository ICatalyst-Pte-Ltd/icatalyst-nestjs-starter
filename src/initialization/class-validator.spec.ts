import { INestApplication, Logger } from '@nestjs/common';
import * as validator from 'class-validator';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../app.module';
import { setupClassValidator } from './class-validator';

// FIXME: a hack to allow the useContainer to be spied on by jest
jest.mock('class-validator', () => {
  return {
    __esModule: true, // to enable jest to spy on
    ...jest.requireActual('class-validator'),
  };
});

describe(setupClassValidator.name, () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(() => {
    app = {} as INestApplication;
    logger = {} as Logger;
    logger.log = jest.fn();
    jest.spyOn(validator, 'useContainer').mockImplementation();
  });

  it('should set up class-validator', () => {
    const value = { id: randomUUID() };
    app.select = jest.fn().mockReturnValue(value);

    const result = setupClassValidator(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toBeCalledWith(
      'Setting up class-validator to use NestJS DI',
    );
    expect(app.select).toBeCalledWith(AppModule);
    expect(validator.useContainer).toBeCalledWith(value, {
      fallbackOnErrors: true,
    });
  });
});
