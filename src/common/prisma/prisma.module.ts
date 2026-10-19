import { Module } from '@nestjs/common';
import { HealthModule } from '../health/index.js';
import { InfoModule } from '../info/index.js';
import { PaginationModule } from './pagination/pagination.module.js';
import { PrismaAdapterFactory } from './prisma-adapter.factory.js';
import { PrismaHealthIndicator } from './prisma.health.js';
import { PrismaConfig } from './prisma.config.js';
import { PrismaInfo } from './prisma.info.js';
import { PrismaService } from './prisma.service.js';

@Module({
  exports: [PrismaAdapterFactory, PrismaConfig, PrismaService],
  imports: [HealthModule, InfoModule, PaginationModule],
  providers: [
    PrismaAdapterFactory,
    PrismaConfig,
    PrismaHealthIndicator,
    PrismaInfo,
    PrismaService,
  ],
})
export class PrismaModule {}
