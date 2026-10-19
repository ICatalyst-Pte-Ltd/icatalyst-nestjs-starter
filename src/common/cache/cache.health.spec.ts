import { Test } from '@nestjs/testing';
import { HealthIndicatorsService } from '../health/index.js';
import { CacheHealthIndicator } from './cache.health.js';

describe(CacheHealthIndicator.name, () => {
  let healthIndicator: CacheHealthIndicator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CacheHealthIndicator,
        { provide: HealthIndicatorsService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    healthIndicator = module.get(CacheHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthIndicator).toBeDefined();
    expect(healthIndicator.name).toBe('cache');
  });

  describe(CacheHealthIndicator.prototype.check.name, () => {
    it('should be okay', () => {
      const result = healthIndicator.check();

      expect(result).toEqual({
        cache: {
          message: 'See /info endpoint for more details',
          status: 'up',
        },
      });
    });
  });
});
