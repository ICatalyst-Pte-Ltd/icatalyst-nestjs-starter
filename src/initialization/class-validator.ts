import { INestApplication, Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export function setupClassValidator(
  app: INestApplication,
  logger: Logger,
): INestApplication {
  logger.log('Setting up class-validator to use NestJS DI');
  // allow the class-validator to use the NestJS container for custom validators
  // that requires DI such as the PrismaService
  // the first parameter must be app.select(AppModule); i.e., the root module, otherwise
  // the lookups will fail to find the custom validators
  // and fallbackOnErrors must be true so that class-validator can use its default container
  // to lookup the its own validators
  const context = app.select(AppModule);
  useContainer(context, { fallbackOnErrors: true });
  return app;
}
