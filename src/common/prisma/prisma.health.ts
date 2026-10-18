import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly prisma: PrismaService,
  ) {}

  async pingCheck(key = 'database'): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicator.check(key);
    try {
      await this.prisma.$queryRaw`SELECT 1;`;
      return indicator.up();
    } catch (error) {
      return indicator.down({
        message: 'Database check failed',
        ...(error instanceof Error ? { error: error.message } : {}),
      });
    }
  }
}
