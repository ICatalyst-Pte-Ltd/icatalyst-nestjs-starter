import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';
import { DEFAULT_REDIS_HOST, DEFAULT_REDIS_PORT } from './redis.constants.js';

interface Env {
  REDIS_HOST: string;
  REDIS_PORT: number;
}

const schema = Joi.object<Env>({
  REDIS_HOST: Joi.string()
    .domain()
    .allow(DEFAULT_REDIS_HOST, 'redis')
    .default(DEFAULT_REDIS_HOST),
  REDIS_PORT: Joi.number().integer().positive().default(DEFAULT_REDIS_PORT),
});

@Injectable()
export class RedisConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly url: string;

  constructor() {
    const { REDIS_HOST: host, REDIS_PORT: port } = validateEnv(schema);
    this.host = host;
    this.port = port;
    this.url = `redis://${host}:${port}`;
  }
}
