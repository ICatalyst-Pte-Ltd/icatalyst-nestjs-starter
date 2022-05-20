import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaHealthIndicator, PrismaService],
  exports: [PrismaHealthIndicator, PrismaService],
})
export class PrismaModule {}
