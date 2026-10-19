import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppConfig } from './app.config.js';
import { AppModule } from './app.module.js';
import { BullMQModule } from './common/bullmq/index.js';
import { CacheModule } from './common/cache/index.js';
import { EventEmitterModule } from './common/event-emitter/index.js';
import { HealthModule } from './common/health/index.js';
import { InfoModule } from './common/info/index.js';
import { PrismaModule, PrismaService } from './common/prisma/index.js';
import { PrismaConfig } from './common/prisma/prisma.config.js';
import { moduleTests } from './common/testing/module-tests.utils.spec.js';

moduleTests(
  AppModule,
  [
    BullMQModule,
    CacheModule,
    EventEmitterModule,
    HealthModule,
    InfoModule,
    PrismaModule,
    // TODO: how to get ValidationPipe that is in global scope?
    // ValidationPipe,
  ],
  {
    beforeEachFn: async (builder) => {
      return builder
        .overrideProvider(AppConfig)
        .useValue({ name: 'app-name', url: 'https://localhost:3000' })
        .overrideProvider(CACHE_MANAGER)
        .useValue({})
        .overrideProvider(PrismaConfig)
        .useValue({
          url: 'postgresql://nestjs:password@localhost:5432/nestjs?schema=public',
        })
        .overrideProvider(PrismaService)
        .useValue({});
    },
    afterEachFn: async (module) => {
      await module.close();
    },
  },
);
