import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import {
  AbstractHealthIndicator,
  HealthIndicatorsService,
} from '../health/index.js';
import { NAME } from './prisma.constants.js';

@Injectable()
export class PrismaHealthIndicator extends AbstractHealthIndicator {
  constructor(indicators: HealthIndicatorsService) {
    super(NAME, indicators);
  }

  check(): HealthIndicatorResult {
    return this.getStatus(this.name, true, {
      message: 'See /info endpoint for more details',
    });
  }
}
