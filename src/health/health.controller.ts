import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../prisma';

/**
 * The controller of the health module
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaHealthIndicator,
  ) {}

  /**
   * Retrieve the health status of this application
   *
   * @returns the health status of this application
   */
  @Get()
  @HealthCheck()
  @Version(VERSION_NEUTRAL)
  healthCheck() {
    return this.health.check([
      () => this.prisma.pingCheck(),
      // TODO: add your health checks here
    ]);
  }
}
