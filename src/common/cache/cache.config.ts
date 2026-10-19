import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

interface Env {
  CACHE_TTL?: number;
  CACHE_URL: string;
}

const schema = Joi.object<Env>({
  CACHE_TTL: Joi.number().integer().positive(),
  CACHE_URL: Joi.string()
    .uri({ scheme: /rediss?/ })
    .default('redis://localhost:6379')
    .example('redis://localhost:6379'),
});

@Injectable()
export class CacheConfig {
  public readonly ttl?: number;
  public readonly url: string;

  constructor() {
    const { CACHE_TTL, CACHE_URL } = validateEnv(schema);
    this.ttl = CACHE_TTL;
    this.url = CACHE_URL;
  }
}
