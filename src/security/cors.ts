import { INestApplication } from '@nestjs/common';

export function setCors(app: INestApplication) {
  app.enableCors({
    origin: (_origin, callback) => {
      const url = process.env.APP_URL;
      const error = url == undefined ? new Error('CORS is undefined') : null;
      callback(error, url);
    },
  });
}
