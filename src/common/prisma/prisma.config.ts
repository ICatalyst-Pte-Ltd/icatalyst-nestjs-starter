import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

interface Env {
  DATABASE_URL: string;
}

const schema = Joi.object<Env>({
  DATABASE_URL: Joi.string()
    .uri({ scheme: /postgres(ql)?/ })
    .required()
    .example(
      'postgresql://nestjs:password@localhost:5432/nestjs?schema=public',
    ),
});

@Injectable()
export class PrismaConfig {
  public readonly url: string;

  constructor() {
    const { DATABASE_URL } = validateEnv(schema);
    this.url = DATABASE_URL;
  }
}
