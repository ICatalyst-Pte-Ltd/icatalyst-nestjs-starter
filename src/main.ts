import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from './initialization';
import { getLogLevels } from './logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });
  initializeApp(app);
  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
