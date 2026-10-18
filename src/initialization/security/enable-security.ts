import { INestApplication, Logger } from '@nestjs/common';
import { setCors } from './cors.js';
import { setSecurityHeaders } from './headers.js';

export function enableSecurity(
  app: INestApplication,
  logger: Logger,
): INestApplication {
  logger.log('Enabling security');
  setSecurityHeaders(app);
  setCors(app);
  return app;
}
