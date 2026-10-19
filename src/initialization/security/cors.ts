import { INestApplication } from '@nestjs/common';
import type { CustomOrigin } from '@nestjs/common/internal';

export function setCors(app: INestApplication): void {
  const origin: CustomOrigin = (requestOrigin, callback) => {
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
    if (allowedOrigins == undefined) {
      const error = new Error('CORS is undefined');
      callback(error, undefined);
    } else {
      const allowedList = allowedOrigins.split(',');
      const origin = allowedList.includes(requestOrigin ?? '')
        ? requestOrigin
        : allowedList[0];
      callback(null, origin);
    }
  };

  app.enableCors({
    origin,
  });
}
