import { INestApplication, Logger } from '@nestjs/common';
import { setupClassValidator } from './class-validator';
import { enableSecurity } from './security';
import { enableSwagger } from './swagger';
import { enableVersioning } from './versioning';

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
