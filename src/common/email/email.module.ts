import { Module } from '@nestjs/common';
import { AWSModule } from '../aws/index.js';
import { EmailService } from './email.service.js';
import { EmailConfig } from './email.config.js';
import { SESTransportService } from './ses-transporter.service.js';

@Module({
  exports: [EmailService],
  imports: [AWSModule],
  providers: [EmailConfig, EmailService, SESTransportService],
})
export class EmailModule {}
