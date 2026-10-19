import { HealthIndicatorStatus } from '@nestjs/terminus';

export interface CacheHealth {
  stores: Array<StoreHealth>;
}

export interface StoreHealth {
  error?: unknown;
  responseTimeInMilliseconds: number;
  status: HealthIndicatorStatus;
  store: string;
}
