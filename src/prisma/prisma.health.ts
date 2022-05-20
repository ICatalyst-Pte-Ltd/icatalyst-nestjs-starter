import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async pingCheck(key = 'database'): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1;`;
      return this.getStatus(key, true);
    } catch (error: any) {
      throw new HealthCheckError(
        'Database check failed',
        this.getStatus(key, false, error),
      );
    }
  }
}
