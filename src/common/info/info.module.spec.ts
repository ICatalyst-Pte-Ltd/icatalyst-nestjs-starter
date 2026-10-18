import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from '../../app.config.js';
import { InfoController } from './info.controller.js';
import { InfoModule } from './info.module.js';
import { InfoService } from './info.service.js';

describe(InfoModule.name, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [InfoModule],
    })
      .overrideProvider(AppConfig)
      .useValue({})
      .compile();
  });

  describe(InfoController.name, () => {
    it('should be defined', () => {
      const infoController = module.get(InfoController);

      expect(infoController).toBeDefined();
    });
  });

  describe(AppConfig.name, () => {
    it('should be defined', () => {
      const appConfig = module.get(AppConfig);

      expect(appConfig).toBeDefined();
    });
  });

  describe(InfoService.name, () => {
    it('should be defined', () => {
      const infoService = module.get(InfoService);

      expect(infoService).toBeDefined();
    });
  });
});
