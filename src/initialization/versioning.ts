import { INestApplication, Logger, VersioningType } from '@nestjs/common';

export function enableVersioning(
  app: INestApplication,
  logger: Logger,
): INestApplication {
  logger.log('Enabling API versioning');
  app.enableVersioning({
    defaultVersion: '2',
    type: VersioningType.URI,
  });
  return app;
}
