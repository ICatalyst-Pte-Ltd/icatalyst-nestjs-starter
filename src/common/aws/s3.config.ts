import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';
import { DEFAULT_CUSTOM_DOMAIN } from './s3.constants.js';

const schema = Joi.object({
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_S3_LOCATION: Joi.string().required(),
  AWS_S3_CUSTOM_DOMAIN: Joi.string().empty('').default(DEFAULT_CUSTOM_DOMAIN),
  // path-style URLs are required by S3-compatible services such as LocalStack
  AWS_S3_FORCE_PATH_STYLE: Joi.boolean().empty('').default(false),
});

@Injectable()
export class S3Config {
  readonly bucketName: string;
  readonly location: string;
  readonly customDomain: string;
  readonly forcePathStyle: boolean;

  constructor() {
    const {
      AWS_S3_BUCKET_NAME,
      AWS_S3_LOCATION,
      AWS_S3_CUSTOM_DOMAIN,
      AWS_S3_FORCE_PATH_STYLE,
    } = validateEnv(schema);
    this.bucketName = AWS_S3_BUCKET_NAME;
    this.location = AWS_S3_LOCATION;
    this.customDomain = AWS_S3_CUSTOM_DOMAIN;
    this.forcePathStyle = AWS_S3_FORCE_PATH_STYLE;
  }
}
