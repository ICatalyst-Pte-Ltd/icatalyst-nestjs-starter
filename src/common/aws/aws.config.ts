import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';
import {
  REGEX_ACCESS_KEY_ID,
  REGEX_SECRET_ACCESS_KEY,
} from './aws.constants.js';

const schema = Joi.object({
  AWS_ACCESS_KEY_ID: Joi.string().pattern(REGEX_ACCESS_KEY_ID),
  AWS_SECRET_ACCESS_KEY: Joi.string().pattern(REGEX_SECRET_ACCESS_KEY),
  AWS_REGION: Joi.string().required(),
});

@Injectable()
export class AWSConfig {
  readonly accessKeyID: string;
  readonly secretAccessKey: string;
  readonly region: string;

  constructor() {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } =
      validateEnv(schema);
    this.accessKeyID = AWS_ACCESS_KEY_ID;
    this.secretAccessKey = AWS_SECRET_ACCESS_KEY;
    this.region = AWS_REGION;
  }
}
