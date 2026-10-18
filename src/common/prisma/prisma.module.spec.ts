import { Test, TestingModule } from '@nestjs/testing';
import { PrismaHealthIndicator } from './prisma.health.js';
import { PrismaModule } from './prisma.module.js';
import { PrismaService } from './prisma.service.js';

describe(PrismaModule.name, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  describe(PrismaHealthIndicator.name, () => {
    it('should be defined', () => {
      const prismaHealthIndicator = module.get(PrismaHealthIndicator);

      expect(prismaHealthIndicator).toBeDefined();
    });
  });

  describe(PrismaService.name, () => {
    it('should be defined', () => {
      const prismaService = module.get(PrismaService);

      expect(prismaService).toBeDefined();
    });
  });
});
