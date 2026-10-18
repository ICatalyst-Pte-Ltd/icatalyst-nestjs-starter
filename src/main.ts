import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { getLogLevels } from './common/logging.js';
import { initializeApp } from './initialization/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
    logger: getLogLevels(),
  });
  initializeApp(app);
  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
