import { HealthIndicatorResult } from '@nestjs/terminus';

/**
 * A {@link HealthIndicator}.
 */
export interface HealthIndicator {
  /**
   * The name of the {@link HealthIndicator}.
   */
  readonly name: string;

  /**
   * Checks the health of the {@link HealthIndicator}.
   */
  check(): HealthIndicatorResult;
}
