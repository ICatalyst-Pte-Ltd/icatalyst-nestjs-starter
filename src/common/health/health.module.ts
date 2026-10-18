import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma/index.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
  imports: [PrismaModule, TerminusModule],
})
export class HealthModule {}
