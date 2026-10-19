import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { RegistryService } from '../info/index.js';
import { PrismaInfo } from './prisma.info.js';
import { PrismaService } from './prisma.service.js';
import { PrismaHealth } from './types.js';

describe(PrismaInfo.name, () => {
  let info: PrismaInfo;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaInfo,
        { provide: PrismaService, useValue: {} },
        { provide: RegistryService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    info = module.get(PrismaInfo);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(info).toBeDefined();
    expect(info.name).toBe('database');
  });

  describe(PrismaInfo.prototype.info.name, () => {
    it('should call the Prisma service health() method', async () => {
      const value = {
        responseTimeInMilliseconds: 1,
        status: 'up',
      } satisfies PrismaHealth;
      prismaService.health = vi.fn().mockReturnValue(of(value));

      const result = await firstValueFrom(info.info());

      expect(result).toBe(value);
      expect(prismaService.health).toHaveBeenCalledTimes(1);
    });
  });
});
