// This import should be first to properly load the .env file
import './common/config/load-environment.js';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './app.config.js';
import { AppModule, ObserveInstrument } from './app.module.js';
import { getLogLevels } from './common/logging/index.js';
import { initializeApp } from './initialization/index.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
    logger: getLogLevels(),
    rawBody: true,
  });
  initializeApp(app);
  const config = app.get(AppConfig);
  await app.listen(config.port);
}
await bootstrap();
