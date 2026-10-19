import { Module, Logger } from '@nestjs/common';
import { BullModule as NestBullModule } from '@nestjs/bullmq';
import { RedisModule } from '../redis/redis.module.js';
import { RedisConfig } from '../redis/redis.config.js';

@Module({
  imports: [
    NestBullModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisConfig],
      useFactory(config: RedisConfig) {
        new Logger(NestBullModule.name).log({
          message: `Connecting to Redis for Bull`,
          host: config.host,
          port: config.port,
        });
        return { connection: { host: config.host, port: config.port } };
      },
    }),
  ],
})
export class BullMQModule extends NestBullModule {}
