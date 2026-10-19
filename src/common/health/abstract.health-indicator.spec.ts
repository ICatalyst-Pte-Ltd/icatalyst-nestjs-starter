import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { AbstractHealthIndicator } from './abstract.health-indicator.js';
import { HealthIndicatorsService } from './health-indicators.service.js';

@Injectable()
class TestIndicator extends AbstractHealthIndicator {
  constructor(indicators: HealthIndicatorsService) {
    super('name', indicators);
  }

  check(): HealthIndicatorResult {
    throw new Error('Method not implemented.');
  }

  status(
    isHealthy: boolean,
    data?: Record<string, unknown>,
  ): HealthIndicatorResult {
    return this.getStatus(this.name, isHealthy, data);
  }
}

describe(AbstractHealthIndicator.name, () => {
  let indicator: TestIndicator;
  let indicators: HealthIndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestIndicator,
        { provide: HealthIndicatorsService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    indicator = module.get(TestIndicator);
    indicators = module.get(HealthIndicatorsService);
  });

  it('should be defined', () => {
    expect(indicator).toBeDefined();
    expect(indicator.name).toBe('name');
    expect(indicators.register).toHaveBeenCalledTimes(1);
    expect(indicators.register).toHaveBeenCalledWith(indicator);
  });

  describe('getStatus', () => {
    it.each([
      { isHealthy: true, status: 'up' },
      { isHealthy: false, status: 'down' },
    ])('$#: should return the $status status', ({ isHealthy, status }) => {
      const result = indicator.status(isHealthy, { message: 'message' });

      expect(result).toEqual({ name: { message: 'message', status } });
    });
  });
});
