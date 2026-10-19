import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { HealthIndicator } from './health-indicator.interface.js';
import { HealthIndicatorsService } from './health-indicators.service.js';

export abstract class AbstractHealthIndicator implements HealthIndicator {
  readonly #healthIndicatorService = new HealthIndicatorService();

  constructor(
    public readonly name: string,
    protected readonly indicators: HealthIndicatorsService,
  ) {
    indicators.register(this);
  }

  abstract check(): HealthIndicatorResult;

  /**
   * Create a {@link HealthIndicatorResult} for the given key.
   *
   * @param key The key of the result.
   * @param isHealthy Whether the status is `up` or `down`.
   * @param data Additional data to include in the result.
   * @returns The {@link HealthIndicatorResult}.
   */
  protected getStatus(
    key: string,
    isHealthy: boolean,
    data?: Record<string, unknown>,
  ): HealthIndicatorResult {
    const session = this.#healthIndicatorService.check(key);
    return isHealthy ? session.up(data) : session.down(data);
  }
}
