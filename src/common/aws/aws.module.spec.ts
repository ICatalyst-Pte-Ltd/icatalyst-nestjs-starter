import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { AWSConfig } from './aws.config.js';
import { AWSModule } from './aws.module.js';
import { BedrockService } from './bedrock.service.js';
import { S3Config } from './s3.config.js';
import { S3Service } from './s3.service.js';

moduleTests(AWSModule, [AWSConfig, BedrockService, S3Config, S3Service], {
  beforeEachFn(builder) {
    return builder
      .overrideProvider(AWSConfig)
      .useValue({ region: 'ap-southeast-1' })
      .overrideProvider(S3Config)
      .useValue({ bucketName: 'bucket', location: 'location' });
  },
});
