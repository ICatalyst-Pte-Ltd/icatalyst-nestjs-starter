import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { firstValueFrom, of } from 'rxjs';
import { InfoController } from './info.controller.js';
import { InfoService } from './info.service.js';

describe(InfoController.name, () => {
  let controller: InfoController;
  let service: InfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoController],
      providers: [{ provide: InfoService, useValue: {} }],
    }).compile();

    controller = module.get(InfoController);
    service = module.get(InfoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(InfoController.prototype.getInfo.name, () => {
    it('should return info', async () => {
      const value = { id: randomUUID() };
      service.getInfo = vi.fn().mockReturnValue(of(value));

      const result = await firstValueFrom(controller.getInfo());

      expect(result).toBe(value);
    });
  });
});
