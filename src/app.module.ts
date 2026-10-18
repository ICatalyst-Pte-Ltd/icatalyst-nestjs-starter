import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from './common/health/index.js';
import { InfoModule } from './common/info/index.js';
import { PrismaModule } from './common/prisma/index.js';
import { createObserveModule } from '@nestjs/observe';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  // it seems that the order of the imports is important to determine the
  // order of onModuleInit and Swagger documentation
  imports: [
    HealthModule,
    InfoModule,
    PrismaModule,
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: 'icatalyst-nestjs-starter',
    }),
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
