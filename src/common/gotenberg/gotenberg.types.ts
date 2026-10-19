import { HealthIndicatorStatus } from '@nestjs/terminus';

export interface GotenbergModuleHealth {
  error?: string;
  status: 'up' | 'down';
  timestamp: string;
}

/**
 * The response of the Gotenberg `/health` route.
 *
 * @see https://gotenberg.dev/docs/routes#health-check-route
 */
export interface GotenbergHealthResponse {
  details: Record<string, GotenbergModuleHealth>;
  status: 'up' | 'down';
}

export interface GotenbergHealth {
  error?: unknown;
  gotenberg?: GotenbergHealthResponse;
  responseTimeInMilliseconds: number;
  status: HealthIndicatorStatus;
}

/**
 * The page properties of the Chromium routes.
 *
 * @see https://gotenberg.dev/docs/routes#page-properties-chromium
 */
export interface PageProperties {
  landscape?: boolean;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  paperHeight?: number;
  paperWidth?: number;
  preferCssPageSize?: boolean;
  printBackground?: boolean;
  scale?: number;
  skipNetworkIdleEvent?: boolean;
}

export interface ConvertOptions extends PageProperties {
  /**
   * The file name of the generated PDF.
   */
  fileName?: string;
}
