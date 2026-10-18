import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/index.js';
import { HealthController } from './health.controller.js';
import { HealthModule } from './health.module.js';

describe(HealthModule.name, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
  });

  describe(HealthController.name, () => {
    it('should be defined', () => {
      const healthController = module.get(HealthController);

      expect(healthController).toBeDefined();
    });
  });

  describe(PrismaModule.name, () => {
    it('should be defined', () => {
      const prismaModule = module.get(PrismaModule);

      expect(prismaModule).toBeDefined();
    });
  });

  describe(TerminusModule.name, () => {
    it('should be defined', () => {
      const terminusModule = module.get(TerminusModule);

      expect(terminusModule).toBeDefined();
    });
  });
});
