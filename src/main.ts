import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeApp } from './initialization';
import { getLogLevels } from './logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });
  initializeApp(app);
  await app.listen(3000);
}
bootstrap();
