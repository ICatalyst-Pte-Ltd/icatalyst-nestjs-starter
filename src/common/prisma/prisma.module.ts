import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health.js';
import { PrismaService } from './prisma.service.js';

@Module({
  imports: [TerminusModule],
  providers: [PrismaHealthIndicator, PrismaService],
  exports: [PrismaHealthIndicator, PrismaService],
})
export class PrismaModule {}
