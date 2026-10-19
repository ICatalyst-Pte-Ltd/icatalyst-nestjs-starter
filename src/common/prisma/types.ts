import { HealthIndicatorStatus } from '@nestjs/terminus';

export interface PrismaHealth {
  error?: unknown;
  responseTimeInMilliseconds: number;
  status: HealthIndicatorStatus;
}
