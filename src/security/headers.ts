import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function setSecurityHeaders(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'connect-src': ["'self'"],
          'default-src': ["'none'"],
          'frame-ancestors': ["'none'"],
          'img-src': ["'self'", 'data:'],
          'script-src-elem': ["'self'"],
          'style-src': [
            "'self'",
            "'sha256-/jDKvbQ8cdux+c5epDIqkjHbXDaIY8RucT1PmAe8FG4='",
            "'sha256-ezdv1bOGcoOD7FKudKN0Y2Mb763O6qVtM8LT2mtanIU='",
            "'sha256-eaPyLWVdqMc60xuz5bTp2yBRgVpQSoUggte1+40ONPU='",
          ],
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
