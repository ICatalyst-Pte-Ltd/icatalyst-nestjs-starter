import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { catchError, from, map, Observable, of } from 'rxjs';
import { PrismaClient } from '~prisma/client.js';
import { PrismaAdapterFactory } from './prisma-adapter.factory.js';
import { PrismaConfig } from './prisma.config.js';
import { PrismaHealth } from './types.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: PrismaConfig, adapterFactory: PrismaAdapterFactory) {
    const adapter = adapterFactory.create(PrismaPg, {
      connectionString: config.url,
    });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  health(): Observable<PrismaHealth> {
    const start = performance.now();
    return from(this.$queryRaw`SELECT 1;`).pipe(
      map(() => {
        const end = performance.now();
        return { end, error: undefined };
      }),
      catchError((error) => {
        const end = performance.now();
        return of({ end, error });
      }),
      map(({ end, error }) => {
        return {
          error,
          responseTimeInMilliseconds: end - start,
          status: error ? 'down' : 'up',
        };
      }),
    );
  }
}
