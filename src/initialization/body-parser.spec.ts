import type { Mock } from 'vitest';
import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { initializeJsonParser } from './body-parser.js';

describe(initializeJsonParser.name, () => {
  let app: NestExpressApplication;
  let log: Mock;
  let logger: Logger;
  let useBodyParser: Mock;

  beforeEach(() => {
    log = vi.fn();
    useBodyParser = vi.fn();
    app = { useBodyParser } as unknown as NestExpressApplication;
    logger = { log } as unknown as Logger;
  });

  it('should initialize the JSON parser', () => {
    const result = initializeJsonParser(app, logger);

    expect(result).toBe(app);
    expect(log).toHaveBeenCalledWith('Initializing JSON parser');
    expect(useBodyParser).toHaveBeenCalledTimes(1);
    expect(useBodyParser).toHaveBeenCalledWith('json', { limit: '1mb' });
  });
});
