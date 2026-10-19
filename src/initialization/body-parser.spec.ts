import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { initializeJsonParser } from './body-parser.js';

describe(initializeJsonParser.name, () => {
  let app: NestExpressApplication;
  let logger: Logger;

  beforeEach(() => {
    app = { useBodyParser: vi.fn() } as unknown as NestExpressApplication;
    logger = { log: vi.fn() } as unknown as Logger;
  });

  it('should initialize the JSON parser', () => {
    const result = initializeJsonParser(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toHaveBeenCalledWith('Initializing JSON parser');
    expect(app.useBodyParser).toHaveBeenCalledTimes(1);
    expect(app.useBodyParser).toHaveBeenCalledWith('json', { limit: '1mb' });
  });
});
