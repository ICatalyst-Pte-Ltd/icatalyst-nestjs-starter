import { PrismaPg } from '@prisma/adapter-pg';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';
import { PrismaAdapterFactory } from './prisma-adapter.factory.js';
import { PrismaConfig } from './prisma.config.js';
import { PrismaService } from './prisma.service.js';

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(),
}));

describe(PrismaService.name, () => {
  const connectionString =
    'postgresql://nestjs:password@localhost:5432/nestjs?schema=public';

  beforeEach(() => {
    vi.mocked(PrismaPg).mockReset();
    vi.mocked(PrismaPg).mockImplementation(function () {
      return {
        adapterName: '@prisma/adapter-pg',
        provider: 'postgres',
      } as unknown as PrismaPg;
    });
  });

  describe('with PrismaAdapterFactory', () => {
    let service: PrismaService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PrismaService,
          PrismaAdapterFactory,
          {
            provide: PrismaConfig,
            useValue: { url: connectionString },
          },
        ],
      }).compile();

      service = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create PrismaPg with the config url', () => {
      expect(PrismaPg).toHaveBeenCalledWith({ connectionString });
    });

    describe(PrismaService.prototype.onModuleInit.name, () => {
      it('should connect', async () => {
        vi.spyOn(service, '$connect').mockResolvedValue();

        await service.onModuleInit();

        expect(service.$connect).toHaveBeenCalled();
      });
    });

    describe(PrismaService.prototype.onModuleDestroy.name, () => {
      it('should disconnect', async () => {
        vi.spyOn(service, '$disconnect').mockResolvedValue();

        await service.onModuleDestroy();

        expect(service.$disconnect).toHaveBeenCalled();
      });
    });

    describe(PrismaService.prototype.health.name, () => {
      it('should return the health', async () => {
        service.$queryRaw = vi.fn().mockResolvedValue({ id: randomUUID() });

        const result = await firstValueFrom(service.health());

        expect(result).toEqual({
          responseTimeInMilliseconds: expect.any(Number),
          status: 'up',
        });
        expect(service.$queryRaw).toHaveBeenCalledWith(['SELECT 1;']);
      });

      it('should handle errors', async () => {
        const error = new Error(`some error: ${randomUUID()}`);
        service.$queryRaw = vi.fn().mockRejectedValue(error);

        const result = await firstValueFrom(service.health());

        expect(result).toEqual({
          error,
          responseTimeInMilliseconds: expect.any(Number),
          status: 'down',
        });
      });
    });
  });

  describe('with mocked PrismaAdapterFactory', () => {
    it('should use the adapter returned by the factory', async () => {
      const mockAdapter = {
        adapterName: 'test-adapter',
        provider: 'postgres',
      } as unknown as PrismaPg;
      const create = vi.fn().mockReturnValue(mockAdapter);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PrismaService,
          {
            provide: PrismaAdapterFactory,
            useValue: { create },
          },
          {
            provide: PrismaConfig,
            useValue: { url: connectionString },
          },
        ],
      }).compile();

      const service = module.get<PrismaService>(PrismaService);

      expect(create).toHaveBeenCalledWith(PrismaPg, {
        connectionString,
      });
      expect(service).toBeDefined();
    });
  });
});
