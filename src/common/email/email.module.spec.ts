import { AWSConfig, S3Config } from '../aws/index.js';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { EmailConfig } from './email.config.js';
import { EmailModule } from './email.module.js';
import { EmailService } from './email.service.js';
import { SESTransportService } from './ses-transporter.service.js';

moduleTests(EmailModule, [EmailConfig, EmailService, SESTransportService], {
  beforeEachFn(builder) {
    return builder
      .overrideProvider(AWSConfig)
      .useValue({ region: 'ap-southeast-1' })
      .overrideProvider(EmailConfig)
      .useValue({ fromEmail: 'test@example.com' })
      .overrideProvider(S3Config)
      .useValue({ bucketName: 'bucket', location: 'location' });
  },
});
