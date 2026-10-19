import { Test } from '@nestjs/testing';
import { HealthIndicatorsService } from '../health/index.js';
import { PrismaHealthIndicator } from './prisma.health.js';

describe(PrismaHealthIndicator.name, () => {
  let healthIndicator: PrismaHealthIndicator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaHealthIndicator,
        { provide: HealthIndicatorsService, useValue: { register: vi.fn() } },
      ],
    }).compile();
    healthIndicator = module.get(PrismaHealthIndicator);
  });

  it('should be defined', () => {
    expect(healthIndicator).toBeDefined();
    expect(healthIndicator.name).toBe('database');
  });

  describe(PrismaHealthIndicator.prototype.check.name, () => {
    it('should be okay', () => {
      const result = healthIndicator.check();

      expect(result).toEqual({
        database: {
          message: 'See /info endpoint for more details',
          status: 'up',
        },
      });
    });
  });
});
