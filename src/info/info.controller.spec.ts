import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from '../app.config';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

describe('InfoController', () => {
  let controller: InfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoController],
      providers: [
        InfoService,
        {
          provide: AppConfig,
          useValue: new AppConfig('app-name'),
        },
      ],
    }).compile();

    controller = module.get<InfoController>(InfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInfo', () => {
    it('should return info', () => {
      expect(controller.getInfo()).toEqual({
        build: {
          version: 'NA',
        },
        ci: {
          pipelineId: 'NA',
          pipelineInternalId: 'NA',
          pipelineUrl: 'NA',
        },
        git: {
          branch: 'NA',
          commit: {
            sha: 'NA',
            time: 'NA',
          },
        },
        name: 'app-name',
      });
    });
  });
});
