import { randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from './common/validations/index.js';

interface Env {
  APP_NAME: string;
  APP_PORT: number;
  APP_URL: string;
}

const schema = Joi.object<Env>({
  APP_NAME: Joi.string().empty('').default(defaultName()),
  APP_PORT: Joi.number().port().empty('').default(3000),
  APP_URL: Joi.string()
    .uri({ scheme: /https?/ })
    .required(),
});

function defaultName(
  prefix = 'app',
  size = 9, // in base64 encoding, use multiple of 3 to avoid padding
  encoding: BufferEncoding = 'base64',
): string {
  return `${prefix}-${randomBytes(size).toString(encoding)}`;
}

@Injectable()
export class AppConfig {
  public readonly name: string;
  public readonly port: number;
  public readonly url: string;

  constructor() {
    const { APP_NAME, APP_PORT, APP_URL } = validateEnv(schema);
    this.name = APP_NAME;
    this.port = APP_PORT;
    this.url = APP_URL;
  }
}
