import { HealthCheckError } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaService } from './prisma.service';

describe(`${PrismaHealthIndicator.name}`, () => {
  let healthIndicator: PrismaHealthIndicator;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaHealthIndicator,
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
      prisma.$queryRaw = jest.fn().mockReturnValue({ result: 'some result' });

      const result = await healthIndicator.pingCheck();

      expect(result).toEqual({ database: { status: 'up' } });
      expect(prisma.$queryRaw).toHaveBeenCalledWith(['SELECT 1;']);
    });

    it('should throw HealthCheckError when any error occurs', async () => {
      prisma.$queryRaw = jest.fn().mockImplementation(() => {
        throw new Error('some error');
      });

      async function pingCheck() {
        return await healthIndicator.pingCheck();
      }

      await expect(pingCheck).rejects.toThrow(
        new HealthCheckError('Database check failed', {}),
      );
    });
  });
});
