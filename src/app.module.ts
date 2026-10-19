import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { createObserveModule } from '@nestjs/observe';
import { BullMQModule } from './common/bullmq/index.js';
import { CacheModule } from './common/cache/index.js';
import { EventEmitterModule } from './common/event-emitter/index.js';
import { HealthModule } from './common/health/index.js';
import { InfoModule } from './common/info/index.js';
import { PrismaModule } from './common/prisma/index.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  // it seems that the order of the imports is important to determine the
  // order of onModuleInit and Swagger documentation
  imports: [
    BullMQModule,
    CacheModule,
    EventEmitterModule,
    HealthModule,
    InfoModule,
    PrismaModule,
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: 'icatalyst-nestjs-starter',
    }),
    // TODO: add your modules; modules with controllers should be in alphabetical order
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
