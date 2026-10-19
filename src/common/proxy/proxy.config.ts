import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

interface Env {
  APP_OPENAPI_URL: string;
}

const schema = Joi.object<Env>({
  APP_OPENAPI_URL: Joi.string().uri().required(),
});

@Injectable()
export class ProxyConfig {
  readonly openApiUrl: string;

  constructor() {
    const { APP_OPENAPI_URL } = validateEnv(schema);
    this.openApiUrl = APP_OPENAPI_URL;
  }
}
