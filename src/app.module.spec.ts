import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from './app.config';
import { AppModule } from './app.module';
import { HealthModule } from './health/health.module';
import { InfoModule } from './info';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

describe(AppModule.name, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AppConfig)
      .useValue({ name: 'app-name', url: 'https://localhost:3000' })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
  });

  describe(HealthModule.name, () => {
    it('should be defined', () => {
      const healthModule = module.get(HealthModule);

      expect(healthModule).toBeDefined();
    });
  });

  describe(InfoModule.name, () => {
    it('should be defined', () => {
      const infoModule = module.get(InfoModule);

      expect(infoModule).toBeDefined();
    });
  });

  describe(PrismaModule.name, () => {
    it('should be defined', () => {
      const prismaModule = module.get(PrismaModule);

      expect(prismaModule).toBeDefined();
    });
  });

  describe(ValidationPipe.name, () => {
    it.skip('should be defined', () => {
      // how to get ValidationPipe that is in global scope?
      const validationPipe = module.get(ValidationPipe);

      expect(validationPipe).toBeDefined();
    });
  });
});
