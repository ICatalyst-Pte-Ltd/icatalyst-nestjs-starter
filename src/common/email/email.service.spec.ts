import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service.js';
import { EmailConfig } from './email.config.js';
import { SESTransportService } from './ses-transporter.service.js';
import { SendEmailDto } from './dto/send-email.dto.js';
import { StreamableFile } from '@nestjs/common';
import { Readable } from 'node:stream';
import { lastValueFrom } from 'rxjs';

class MockStreamableFile {
  options: StreamableFile['options'];
  private stream: Readable;

  constructor() {
    this.stream = Readable.from([
      'Mock data line 1',
      'Mock data line 2',
      'Mock data line 3',
    ]);
    this.options = {};
  }
  getStream(): Readable {
    return this.stream;
  }
  getHeaders(): { type: string; disposition: string; length: number } {
    return {
      type: 'application/pdf',
      disposition: 'attachment',
      length: 1234,
    };
  }
}

describe('EmailService', () => {
  let service: EmailService;
  let emailConfig: EmailConfig;
  let transportService: SESTransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: EmailConfig,
          useValue: {
            fromMail: 'test@thecynefin.co',
          },
        },
        {
          provide: SESTransportService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(EmailService);
    emailConfig = module.get(EmailConfig);
    transportService = module.get(SESTransportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    it('should send email successfully', async () => {
      const sendEmailDto: SendEmailDto = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<html>This is a test email</html>',
      };

      transportService.createTransporter = vi.fn().mockReturnValue({
        sendMail: vi.fn().mockImplementation((mailOptions, callback) => {
          callback(null, 'Email sent successfully');
        }),
      });

      await lastValueFrom(service.sendMail(sendEmailDto));

      expect(transportService.createTransporter).toHaveBeenCalledTimes(1);
      expect(
        transportService.createTransporter().sendMail,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          from: emailConfig.fromEmail,
          to: sendEmailDto.to,
          subject: sendEmailDto.subject,
          text: sendEmailDto.text,
          html: sendEmailDto.html,
        }),
        expect.any(Function),
      );
    });

    it('should send email with attachment successfully', async () => {
      const sendEmailDto: SendEmailDto = {
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<html>This is a test email</html>',
      };

      const attachment: StreamableFile =
        new MockStreamableFile() as unknown as StreamableFile;
      const attachmentOptions = {
        attachment,
        contentType: 'text/csv',
        fileName: 'name',
      };

      transportService.createTransporter = vi.fn().mockReturnValue({
        sendMail: vi.fn().mockImplementation((mailOptions, callback) => {
          callback(null, 'Email sent successfully');
        }),
      });

      await lastValueFrom(service.sendMail(sendEmailDto, attachmentOptions));

      expect(transportService.createTransporter).toHaveBeenCalledTimes(1);
      expect(
        transportService.createTransporter().sendMail,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          from: emailConfig.fromEmail,
          to: sendEmailDto.to,
          subject: sendEmailDto.subject,
          text: sendEmailDto.text,
          html: sendEmailDto.html,
          attachments: [
            {
              content: attachmentOptions.attachment.getStream(),
              contentType: attachmentOptions.contentType,
              filename: attachmentOptions.fileName,
            },
          ],
        }),
        expect.any(Function),
      );
    });

    it('should handle error when sending email fails', async () => {
      const sendEmailDto: SendEmailDto = {
        to: 'invalidemail@example.com',
        subject: 'Test Email',
        text: 'This is a test email',
        html: '<html>This is a test email</html>',
      };
      const errorMessage = 'Failed to send email';

      transportService.createTransporter = vi.fn().mockReturnValue({
        sendMail: vi.fn().mockImplementation((mailOptions, callback) => {
          if (mailOptions.to != 'test@example.com') {
            callback(new Error('Failed to send email'), null);
          }
        }),
      });

      await expect(
        lastValueFrom(service.sendMail(sendEmailDto)),
      ).rejects.toEqual(errorMessage);
    });
  });
});
