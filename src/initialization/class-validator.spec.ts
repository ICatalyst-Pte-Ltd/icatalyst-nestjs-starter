import { INestApplication, Logger } from '@nestjs/common';
import * as validator from 'class-validator';
import { randomUUID } from 'node:crypto';
import { type Mock, vi } from 'vitest';
import { AppModule } from '../app.module.js';
import { setupClassValidator } from './class-validator.js';

vi.mock('class-validator', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('class-validator')>()),
  };
});

describe(setupClassValidator.name, () => {
  let app: INestApplication;
  let log: Mock;
  let logger: Logger;

  beforeEach(() => {
    app = {} as INestApplication;
    log = vi.fn();
    logger = { log } as unknown as Logger;
    vi.spyOn(validator, 'useContainer').mockImplementation(() => {});
  });

  it('should set up class-validator', () => {
    const value = { id: randomUUID() };
    const select = vi.fn().mockReturnValue(value);
    app.select = select;

    const result = setupClassValidator(app, logger);

    expect(result).toBe(app);
    expect(log).toBeCalledWith('Setting up class-validator to use NestJS DI');
    expect(select).toBeCalledWith(AppModule);
    expect(validator.useContainer).toBeCalledWith(value, {
      fallbackOnErrors: true,
    });
  });
});
