import { createTransport } from 'nodemailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { AWSConfig } from '../aws/index.js';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class SESTransportService {
  private readonly logger = new Logger(SESTransportService.name);

  constructor(private readonly awsConfig: AWSConfig) {}

  createTransporter(): ReturnType<typeof createTransport> {
    const sesClient = new SESClient({
      region: this.awsConfig.region,
    });

    return createTransport({
      name: 'SESv1-Custom',
      version: '1.0.0',
      send: async (mail, callback) => {
        try {
          const raw = await new Promise<Buffer>((resolve, reject) => {
            mail.message.build((err, message) => {
              if (err) reject(err);
              else resolve(message);
            });
          });

          const command = new SendRawEmailCommand({
            RawMessage: {
              Data: raw,
            },
          });

          const result = await sesClient.send(command);
          const envelope = mail.message.getEnvelope();
          const toAddresses = (envelope.to || []) as Array<
            string | Mail.Address
          >;

          callback(null, {
            messageId: result.MessageId || 'sent',
            envelope: envelope,
            accepted: toAddresses,
            rejected: [],
            pending: [],
            response: 'OK',
          });
        } catch (error) {
          this.logger.error('SES send error:', error);
          callback(error as Error, {
            messageId: '',
            envelope: mail.message.getEnvelope(),
            accepted: [],
            rejected: [],
            pending: [],
            response: 'ERROR',
          });
        }
      },
    });
  }
}
