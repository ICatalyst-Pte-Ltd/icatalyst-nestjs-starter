import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

const schema = Joi.object({
  EMAIL_FROM: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

@Injectable()
export class EmailConfig {
  public readonly fromEmail: string;

  constructor() {
    const { EMAIL_FROM } = validateEnv(schema);
    this.fromEmail = EMAIL_FROM;
  }
}
