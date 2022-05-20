import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { InfoModule } from './info/info.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  // it seems that the order of the imports is important to determine the order of onModuleInit
  imports: [HealthModule, InfoModule, PrismaModule],
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
