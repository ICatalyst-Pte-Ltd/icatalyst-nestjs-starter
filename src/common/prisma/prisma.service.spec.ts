import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect', async () => {
      vi.spyOn(service, '$connect').mockImplementation(async () => {});

      await service.onModuleInit();

      expect(service.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect', async () => {
      vi.spyOn(service, '$disconnect').mockImplementation(async () => {});

      await service.onModuleDestroy();

      expect(service.$disconnect).toHaveBeenCalled();
    });
  });
});
