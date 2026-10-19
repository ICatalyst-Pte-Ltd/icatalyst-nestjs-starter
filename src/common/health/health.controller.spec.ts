import { ServiceUnavailableException } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthIndicatorsService } from './health-indicators.service.js';
import { HealthController } from './health.controller.js';

describe(HealthController.name, () => {
  let controller: HealthController;
  let indicators: HealthIndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        HealthController,
        { provide: HealthIndicatorsService, useValue: {} },
      ],
    }).compile();

    controller = module.get(HealthController);
    indicators = module.get(HealthIndicatorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(HealthController.prototype.healthCheck.name, () => {
    it('should check all registered health indicators', async () => {
      const indicator1 = {
        check: vi.fn().mockReturnValue({
          indicator1: { status: 'up' },
        }),
      };
      const indicator2 = {
        check: vi.fn().mockReturnValue({
          indicator2: { status: 'up' },
        }),
      };
      indicators.list = vi.fn().mockReturnValue([indicator1, indicator2]);

      const result = await controller.healthCheck();

      expect(result).toEqual({
        details: {
          indicator1: { status: 'up' },
          indicator2: { status: 'up' },
        },
        error: {},
        info: {
          indicator1: { status: 'up' },
          indicator2: { status: 'up' },
        },
        status: 'ok',
      });
      expect(indicator1.check).toHaveBeenCalledTimes(1);
      expect(indicator2.check).toHaveBeenCalledTimes(1);
    });

    it('should throw ServiceUnavailableException if one of the indicators is down', async () => {
      const indicator1 = {
        check: vi.fn().mockReturnValue({
          indicator1: { status: 'up' },
        }),
      };
      const indicator2 = {
        check: vi.fn().mockReturnValue({
          indicator2: { status: 'down' },
        }),
      };
      indicators.list = vi.fn().mockReturnValue([indicator1, indicator2]);

      async function check() {
        await controller.healthCheck();
      }

      await expect(check).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
