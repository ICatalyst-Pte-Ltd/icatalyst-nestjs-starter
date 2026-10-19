import type { Mock, MockedClass, MockedFunction } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AWSConfig } from '../aws/index.js';
import { SESTransportService } from './ses-transporter.service.js';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';

vi.mock('nodemailer');
vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: vi.fn().mockImplementation(function () {
    return { send: vi.fn() };
  }),
  SendRawEmailCommand: vi.fn(),
}));

interface MockMail {
  message: {
    build: Mock;
    getEnvelope: Mock;
  };
}

interface CustomTransport {
  send: (mail: MockMail, callback: Mock) => Promise<void>;
}

describe('SESTransportService', () => {
  let service: SESTransportService;
  let awsConfig: AWSConfig;
  let mockCreateTransport: MockedFunction<typeof createTransport>;
  let mockSESClient: MockedClass<typeof SESClient>;

  beforeEach(async () => {
    mockCreateTransport = createTransport as MockedFunction<
      typeof createTransport
    >;
    mockSESClient = SESClient as MockedClass<typeof SESClient>;
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SESTransportService,
        {
          provide: AWSConfig,
          useValue: {
            region: 'ap-southeast-1',
          },
        },
      ],
    }).compile();

    service = module.get<SESTransportService>(SESTransportService);
    awsConfig = module.get<AWSConfig>(AWSConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransporter', () => {
    it('should create transporter with custom SES transport', () => {
      const mockTransporter = { sendMail: vi.fn() };
      mockCreateTransport.mockReturnValue(
        mockTransporter as unknown as ReturnType<typeof createTransport>,
      );

      const result = service.createTransporter();

      expect(createTransport).toHaveBeenCalledTimes(1);
      expect(createTransport).toHaveBeenCalledWith({
        name: 'SESv1-Custom',
        version: '1.0.0',
        send: expect.any(Function),
      });

      expect(SESClient).toHaveBeenCalledTimes(1);
      expect(SESClient).toHaveBeenCalledWith({
        region: awsConfig.region,
      });

      expect(result).toBe(mockTransporter);
    });

    it('should handle email sending in custom transport', async () => {
      const mockSend = vi
        .fn()
        .mockResolvedValue({ MessageId: 'test-message-id' });
      mockSESClient.mockImplementation(function () {
        return { send: mockSend } as unknown as SESClient;
      });

      const mockTransporter = { sendMail: vi.fn() };
      mockCreateTransport.mockReturnValue(
        mockTransporter as unknown as ReturnType<typeof createTransport>,
      );

      service.createTransporter();

      const transportConfig = mockCreateTransport.mock
        .calls[0][0] as unknown as CustomTransport;
      const sendFunction = transportConfig.send;

      const mockMail = {
        message: {
          build: vi.fn((callback) => callback(null, Buffer.from('raw email'))),
          getEnvelope: vi.fn().mockReturnValue({
            from: 'test@example.com',
            to: ['recipient@example.com'],
          }),
        },
      };

      const mockCallback = vi.fn();

      await sendFunction(mockMail, mockCallback);

      expect(SendRawEmailCommand).toHaveBeenCalledWith({
        RawMessage: {
          Data: Buffer.from('raw email'),
        },
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(null, {
        messageId: 'test-message-id',
        envelope: {
          from: 'test@example.com',
          to: ['recipient@example.com'],
        },
        accepted: ['recipient@example.com'],
        rejected: [],
        pending: [],
        response: 'OK',
      });
    });

    it('should handle errors in custom transport', async () => {
      const mockError = new Error('SES error');
      const mockSend = vi.fn().mockRejectedValue(mockError);
      mockSESClient.mockImplementation(function () {
        return { send: mockSend } as unknown as SESClient;
      });

      const mockTransporter = { sendMail: vi.fn() };
      mockCreateTransport.mockReturnValue(
        mockTransporter as unknown as ReturnType<typeof createTransport>,
      );

      service.createTransporter();

      const transportConfig = mockCreateTransport.mock
        .calls[0][0] as unknown as CustomTransport;
      const sendFunction = transportConfig.send;

      const mockMail = {
        message: {
          build: vi.fn((callback) => callback(null, Buffer.from('raw email'))),
          getEnvelope: vi.fn().mockReturnValue({
            from: 'test@example.com',
            to: ['recipient@example.com'],
          }),
        },
      };

      const mockCallback = vi.fn();

      await sendFunction(mockMail, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(mockError, {
        messageId: '',
        envelope: {
          from: 'test@example.com',
          to: ['recipient@example.com'],
        },
        accepted: [],
        rejected: [],
        pending: [],
        response: 'ERROR',
      });
    });

    it('should use default values if there is no message ID or recipients', async () => {
      mockSESClient.mockImplementation(function () {
        return { send: vi.fn().mockResolvedValue({}) } as unknown as SESClient;
      });
      mockCreateTransport.mockReturnValue({
        sendMail: vi.fn(),
      } as unknown as ReturnType<typeof createTransport>);

      service.createTransporter();

      const transportConfig = mockCreateTransport.mock
        .calls[0][0] as unknown as CustomTransport;
      const mockMail = {
        message: {
          build: vi.fn((callback) => callback(null, Buffer.from('raw email'))),
          getEnvelope: vi.fn().mockReturnValue({ from: 'test@example.com' }),
        },
      };
      const mockCallback = vi.fn();

      await transportConfig.send(mockMail, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, {
        messageId: 'sent',
        envelope: { from: 'test@example.com' },
        accepted: [],
        rejected: [],
        pending: [],
        response: 'OK',
      });
    });

    it('should handle email build errors', async () => {
      const mockTransporter = { sendMail: vi.fn() };
      mockCreateTransport.mockReturnValue(
        mockTransporter as unknown as ReturnType<typeof createTransport>,
      );

      service.createTransporter();

      const transportConfig = mockCreateTransport.mock
        .calls[0][0] as unknown as CustomTransport;
      const sendFunction = transportConfig.send;

      const buildError = new Error('Build error');
      const mockMail = {
        message: {
          build: vi.fn((callback) => callback(buildError)),
          getEnvelope: vi.fn().mockReturnValue({
            from: 'test@example.com',
            to: ['recipient@example.com'],
          }),
        },
      };

      const mockCallback = vi.fn();

      await sendFunction(mockMail, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(buildError, {
        messageId: '',
        envelope: {
          from: 'test@example.com',
          to: ['recipient@example.com'],
        },
        accepted: [],
        rejected: [],
        pending: [],
        response: 'ERROR',
      });
    });
  });
});
