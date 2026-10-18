import { INestApplication, Logger } from '@nestjs/common';
import { setupClassValidator } from './class-validator.js';
import { enableSecurity } from './security/index.js';
import { enableSwagger } from './swagger.js';
import { enableVersioning } from './versioning.js';

export function initializeApp(
  app: INestApplication,
  logger: Logger = new Logger('Initialization'),
): INestApplication {
  logger.log('Initializing application');
  enableSecurity(app, logger);
  enableVersioning(app, logger);
  // for Swagger to automatically pick up the versioning,
  // it must be after enabling versioning
  enableSwagger(app, logger);
  setupClassValidator(app, logger);
  return app;
}
