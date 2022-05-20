import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [PrismaModule, TerminusModule],
})
export class HealthModule {}
