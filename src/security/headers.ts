import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function setSecurityHeaders(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'none'"],
          'frame-ancestors': ["'none'"],
        },
        useDefaults: false,
      },
      frameguard: {
        action: 'deny',
      },
      hsts: {
        maxAge: 31536000,
      },
    }),
  );
}
