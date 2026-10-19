import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';
import { DEFAULT_CUSTOM_DOMAIN } from './s3.constants.js';

const schema = Joi.object({
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_S3_LOCATION: Joi.string().required(),
  AWS_S3_CUSTOM_DOMAIN: Joi.string().empty('').default(DEFAULT_CUSTOM_DOMAIN),
});

@Injectable()
export class S3Config {
  readonly bucketName: string;
  readonly location: string;
  readonly customDomain: string;

  constructor() {
    const { AWS_S3_BUCKET_NAME, AWS_S3_LOCATION, AWS_S3_CUSTOM_DOMAIN } =
      validateEnv(schema);
    this.bucketName = AWS_S3_BUCKET_NAME;
    this.location = AWS_S3_LOCATION;
    // TODO: missing coverage test?
    this.customDomain = AWS_S3_CUSTOM_DOMAIN || DEFAULT_CUSTOM_DOMAIN;
  }
}
