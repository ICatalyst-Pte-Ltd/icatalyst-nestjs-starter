import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';

export function initializeJsonParser(
  app: NestExpressApplication,
  logger: Logger,
): NestExpressApplication {
  logger.log('Initializing JSON parser');
  app.useBodyParser('json', { limit: '1mb' });
  return app;
}
