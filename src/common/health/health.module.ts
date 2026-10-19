import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthIndicatorsService } from './health-indicators.service.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [HealthController],
  exports: [HealthIndicatorsService],
  imports: [TerminusModule],
  providers: [HealthIndicatorsService.provider()],
})
export class HealthModule {}
