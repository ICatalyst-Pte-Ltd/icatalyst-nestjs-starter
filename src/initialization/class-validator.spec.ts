import { INestApplication, Logger } from '@nestjs/common';
import * as validator from 'class-validator';
import { randomUUID } from 'node:crypto';
import { vi } from 'vitest';
import { AppModule } from '../app.module.js';
import { setupClassValidator } from './class-validator.js';

vi.mock('class-validator', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('class-validator')>()),
  };
});

describe(setupClassValidator.name, () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(() => {
    app = {} as INestApplication;
    logger = {} as Logger;
    logger.log = vi.fn();
    vi.spyOn(validator, 'useContainer').mockImplementation(() => {});
  });

  it('should set up class-validator', () => {
    const value = { id: randomUUID() };
    app.select = vi.fn().mockReturnValue(value);

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
