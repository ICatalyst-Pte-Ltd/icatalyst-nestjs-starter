import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { HealthCheckError, TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator } from '../prisma';
import { HealthController } from './health.controller';

Logger.prototype.error = jest.fn();

describe(`${HealthController.name}`, () => {
  let controller: HealthController;
  let prismaHealthIndicator: PrismaHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        HealthController,
        {
          provide: PrismaHealthIndicator,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get(HealthController);
    prismaHealthIndicator = module.get(PrismaHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    // TODO: add your tests for the healthCheck method here
    it('should be okay when all health indicators are okay', async () => {
      prismaHealthIndicator.pingCheck = jest.fn().mockReturnValue({
        database: { status: 'up' },
      });

      const result = await controller.healthCheck();

      expect(result).toEqual({
        details: {
          database: { status: 'up' },
        },
        error: {},
        info: {
          database: { status: 'up' },
        },
        status: 'ok',
      });
      expect(prismaHealthIndicator.pingCheck).toHaveBeenCalledWith();
    });

    it('should throw ServiceUnavailableException if prisma is not okay', async () => {
      prismaHealthIndicator.pingCheck = jest
        .fn()
        .mockRejectedValue(
          new HealthCheckError('Database', { database: { status: 'down' } }),
        );

      async function healthCheck() {
        await controller.healthCheck();
      }

      await expect(healthCheck).rejects.toThrow(ServiceUnavailableException);
      expect(prismaHealthIndicator.pingCheck).toHaveBeenCalledWith();
    });
  });
});
