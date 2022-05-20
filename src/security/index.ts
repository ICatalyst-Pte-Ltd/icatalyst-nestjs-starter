import { INestApplication, Logger } from '@nestjs/common';
import { setCors } from './cors';
import { setSecurityHeaders } from './headers';

export function enableSecurity(
  app: INestApplication,
  logger: Logger,
): INestApplication {
  logger.log('Enabling security');
  setSecurityHeaders(app);
  setCors(app);
  return app;
}
