import { Module } from '@nestjs/common';
import { AWSConfig } from './aws.config.js';
import { S3Service } from './s3.service.js';
import { S3Config } from './s3.config.js';
import { BedrockService } from './bedrock.service.js';

@Module({
  exports: [AWSConfig, BedrockService, S3Config, S3Service],
  providers: [AWSConfig, BedrockService, S3Config, S3Service],
})
export class AWSModule {}
