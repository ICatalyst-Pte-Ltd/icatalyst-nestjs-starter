import { Injectable, Logger } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer/index';
import { Observable } from 'rxjs';
import { SendEmailDto } from './dto/send-email.dto.js';
import { EmailConfig } from './email.config.js';
import { AttachmentOptions } from './email.type.js';
import { SESTransportService } from './ses-transporter.service.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly emailConfig: EmailConfig,
    private readonly transportService: SESTransportService,
  ) {}

  sendMail(
    sendEmailDto: SendEmailDto,
    attachmentOptions?: AttachmentOptions,
  ): Observable<void> {
    this.logger.debug({ method: this.sendMail.name, sendEmailDto });
    return new Observable<void>((subscriber) => {
      const transporter = this.transportService.createTransporter();
      const { to, text, subject, html } = sendEmailDto;

      const mailOptions: Mail.Options = {
        from: this.emailConfig.fromEmail,
        to,
        subject,
        text,
        html,
      };

      if (attachmentOptions) {
        mailOptions.attachments = [
          {
            filename: attachmentOptions.fileName,
            contentType: attachmentOptions.contentType,
            content: attachmentOptions.attachment?.getStream(),
          },
        ];
      }
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          this.logger.error({ method: this.sendMail.name, error });
          subscriber.error('Failed to send email');
        } else {
          // this.logger.debug({ method: this.sendMail.name, info });
          subscriber.next();
          subscriber.complete();
        }
      });
    });
  }
}
