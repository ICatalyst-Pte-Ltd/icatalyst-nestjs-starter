import { Logger } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { initializeJsonParser } from './body-parser.js';
import { setupClassValidator } from './class-validator.js';
import { enableSecurity } from './security/index.js';
import { enableSwagger } from './swagger.js';
import { enableVersioning } from './versioning.js';

export function initializeApp(
  app: NestExpressApplication,
  logger: Logger = new Logger('Initialization'),
): NestExpressApplication {
  logger.log('Initializing application');
  enableSecurity(app, logger);
  enableVersioning(app, logger);
  // for Swagger to automatically pick up the versioning,
  // it must be after enabling versioning
  enableSwagger(app, logger);
  setupClassValidator(app, logger);
  initializeJsonParser(app, logger);
  return app;
}
