import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogLevels } from './logging';
import { secure } from './security';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(),
  });
  secure(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
