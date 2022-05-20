import { INestApplication } from '@nestjs/common';

export function setCors(app: INestApplication) {
  app.enableCors({
    origin: (requestOrigin, callback) => {
      const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
      if (allowedOrigins == undefined) {
        const error = new Error('CORS is undefined');
        callback(error, undefined);
      } else {
        const allowedList = allowedOrigins.split(',');
        const origin = allowedList.includes(requestOrigin)
          ? requestOrigin
          : allowedList[0];
        callback(null, origin);
      }
    },
  });
}
