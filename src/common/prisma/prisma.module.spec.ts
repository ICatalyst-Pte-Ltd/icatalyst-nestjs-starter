import { AppConfig } from '../../app.config.js';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { PrismaHealthIndicator } from './prisma.health.js';
import { PrismaInfo } from './prisma.info.js';
import { PrismaModule } from './prisma.module.js';
import { PrismaConfig } from './prisma.config.js';
import { PrismaService } from './prisma.service.js';

moduleTests(PrismaModule, [PrismaHealthIndicator, PrismaInfo, PrismaService], {
  beforeEachFn(builder) {
    return builder
      .overrideProvider(AppConfig)
      .useValue({})
      .overrideProvider(PrismaConfig)
      .useValue({
        url: 'postgresql://nestjs:password@localhost:5432/nestjs?schema=public',
      })
      .overrideProvider(PrismaService)
      .useValue({});
  },
});
