import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import {
  AbstractHealthIndicator,
  HealthIndicatorsService,
} from '../health/index.js';
import { NAME } from './constants.js';

@Injectable()
export class CacheHealthIndicator extends AbstractHealthIndicator {
  constructor(indicators: HealthIndicatorsService) {
    super(NAME, indicators);
  }

  check(): HealthIndicatorResult {
    return this.getStatus(this.name, true, {
      message: 'See /info endpoint for more details',
    });
  }
}
