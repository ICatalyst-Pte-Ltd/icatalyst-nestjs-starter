import { Test } from '@nestjs/testing';
import { HealthIndicatorsService } from '../health/index.js';
import { GotenbergHealthIndicator } from './gotenberg.health.js';

describe(GotenbergHealthIndicator.name, () => {
  let healthIndicator: GotenbergHealthIndicator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GotenbergHealthIndicator,
        { provide: HealthIndicatorsService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    healthIndicator = module.get(GotenbergHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthIndicator).toBeDefined();
    expect(healthIndicator.name).toBe('gotenberg');
  });

  describe(GotenbergHealthIndicator.prototype.check.name, () => {
    it('should be okay', () => {
      const result = healthIndicator.check();

      expect(result).toEqual({
        gotenberg: {
          message: 'See /info endpoint for more details',
          status: 'up',
        },
      });
    });
  });
});
