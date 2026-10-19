import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

interface Env {
  GOTENBERG_URL: string;
}

const schema = Joi.object<Env>({
  GOTENBERG_URL: Joi.string()
    .uri({ scheme: /https?/ })
    .required()
    .example('http://localhost:4000'),
});

@Injectable()
export class GotenbergConfig {
  public readonly url: string;

  constructor() {
    const { GOTENBERG_URL } = validateEnv(schema);
    this.url = GOTENBERG_URL;
  }
}
