import {
  Controller,
  Get,
  Logger,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { SkipAuthentication } from '../auth/index.js';
import { HealthIndicatorsService } from './health-indicators.service.js';

/**
 * The controller of the health module
 */
@Controller('health')
@SkipAuthentication()
export class HealthController {
  readonly #logger = new Logger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly indicators: HealthIndicatorsService,
  ) {}

  /**
   * Retrieve the health status of this application
   *
   * @returns the health status of this application
   */
  @Get()
  @HealthCheck()
  @Version(VERSION_NEUTRAL)
  healthCheck(): Promise<HealthCheckResult> {
    const indicators = this.indicators.list();
    this.#logger.debug({
      method: this.healthCheck.name,
      indicators,
    });
    const checks = indicators.map((indicator) => () => indicator.check());
    return this.health.check(checks);
  }
}
