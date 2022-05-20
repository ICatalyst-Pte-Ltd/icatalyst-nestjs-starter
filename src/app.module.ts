import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from './health';
import { InfoModule } from './info';
import { PrismaModule } from './prisma';

@Module({
  // it seems that the order of the imports is important to determine the
  // order of onModuleInit and Swagger documentation
  imports: [
    HealthModule,
    InfoModule,
    PrismaModule,
    // TODO: add your modules
  ],
  providers: [
    {
      provide: APP_PIPE,
      // NOTE: transform must be true if we want to use the default values from the entity classes
      // otherwise, they will be undefined
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
