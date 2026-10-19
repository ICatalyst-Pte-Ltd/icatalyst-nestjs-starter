import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthModule } from '../health/index.js';
import { InfoModule } from '../info/index.js';
import { GotenbergConfig } from './gotenberg.config.js';
import { GotenbergHealthIndicator } from './gotenberg.health.js';
import { GotenbergInfo } from './gotenberg.info.js';
import { GotenbergService } from './gotenberg.service.js';

@Module({
  exports: [GotenbergService],
  imports: [HealthModule, HttpModule, InfoModule],
  providers: [
    GotenbergConfig,
    GotenbergHealthIndicator,
    GotenbergInfo,
    GotenbergService,
  ],
})
export class GotenbergModule {}
