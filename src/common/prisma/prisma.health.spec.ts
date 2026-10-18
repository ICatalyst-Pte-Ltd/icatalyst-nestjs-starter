import { HealthIndicatorService } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { PrismaHealthIndicator } from './prisma.health.js';
import { PrismaService } from './prisma.service.js';

describe(`${PrismaHealthIndicator.name}`, () => {
  let healthIndicator: PrismaHealthIndicator;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaHealthIndicator,
        HealthIndicatorService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();
    healthIndicator = module.get(PrismaHealthIndicator);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(healthIndicator).toBeDefined();
  });

  describe('pingCheck', () => {
    it('should be okay when connected to database', async () => {
      prisma.$queryRaw = vi.fn().mockReturnValue({ result: 'some result' });

      const result = await healthIndicator.pingCheck();

      expect(result).toEqual({ database: { status: 'up' } });
      expect(prisma.$queryRaw).toHaveBeenCalledWith(['SELECT 1;']);
    });

    it('should return a down status when the database check fails', async () => {
      prisma.$queryRaw = vi.fn().mockImplementation(() => {
        throw new Error('some error');
      });

      const result = await healthIndicator.pingCheck();

      expect(result).toEqual({
        database: {
          status: 'down',
          message: 'Database check failed',
          error: 'some error',
        },
      });
    });
  });
});
