import { Module } from '@nestjs/common';
import { RedisConfig } from './redis.config.js';

@Module({
  exports: [RedisConfig],
  providers: [RedisConfig],
})
export class RedisModule {}
