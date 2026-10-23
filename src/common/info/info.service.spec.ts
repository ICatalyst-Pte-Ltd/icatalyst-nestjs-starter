import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { firstValueFrom, of } from 'rxjs';
import { AppConfig } from '../../app.config.js';
import { Info } from './entities/info.entity.js';
import { mockInfo } from './entities/info.entity.utils.spec.js';
import { InfoService } from './info.service.js';
import { RegistryService } from './registry.service.js';
import { mockInfoExtension } from './registry.service.utils.spec.js';

describe(InfoService.name, () => {
  const env = { ...process.env };
  let service: InfoService;
  let registry: RegistryService;

  beforeEach(async () => {
    process.env = { ...env };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfoService,
        {
          provide: AppConfig,
          useValue: { name: 'app-name', url: 'https://localhost:3000' },
        },
        {
          provide: RegistryService,
          useValue: { list: vi.fn().mockReturnValue([]) },
        },
      ],
    }).compile();

    service = module.get(InfoService);
    registry = module.get(RegistryService);
  });

  afterAll(() => {
    process.env = { ...env };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(InfoService.prototype.getInfo.name, () => {
    let info: Info;

    beforeEach(() => {
      info = mockInfo({});
      process.env.APP_INFO_BUILD_VERSION = info.build.version;
      process.env.APP_INFO_CI_PIPELINE_ID = info.ci.pipelineId;
      process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID = info.ci.pipelineInternalId;
      process.env.APP_INFO_CI_PIPELINE_URL = info.ci.pipelineUrl;
      process.env.APP_INFO_GIT_BRANCH = info.git.branch;
      process.env.APP_INFO_GIT_COMMIT_SHA = info.git.commit.sha;
      process.env.APP_INFO_GIT_COMMIT_TIME = info.git.commit.time;
    });

    it('should return info', async () => {
      registry.list = vi.fn().mockReturnValue([]);

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result).toEqual({
        build: info.build,
        ci: info.ci,
        extensions: info.extensions,
        git: info.git,
        name: 'app-name',
        url: 'https://localhost:3000',
      });
    });

    it('should include the info from the extensions', async () => {
      const values = [{ id: randomUUID() }, { id: randomUUID() }];
      const extensions = values.map((value) =>
        mockInfoExtension({ info: vi.fn().mockReturnValue(of(value)) }),
      );
      registry.list = vi.fn().mockReturnValue(extensions);

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.extensions).toEqual(
        extensions.reduce((previous, current, index) => {
          return { ...previous, [current.name]: values[index] };
        }, {}),
      );
    });

    it('should keep the info from the extensions as is', async () => {
      class RequiredArgumentError extends Error {
        constructor({ code }: { code: string }) {
          super(code);
        }
      }
      const value = { error: new RequiredArgumentError({ code: 'P1001' }) };
      const extension = mockInfoExtension({
        info: vi.fn().mockReturnValue(of(value)),
      });
      registry.list = vi.fn().mockReturnValue([extension]);

      const result = await firstValueFrom(service.getInfo());

      expect(result).toBeInstanceOf(Info);
      expect(result.extensions[extension.name]).toBe(value);
    });

    it('should return replace build version with NA if undefined', async () => {
      delete process.env.APP_INFO_BUILD_VERSION;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.build.version).toEqual('NA');
    });

    it('should return replace build version with NA if blank', async () => {
      process.env.APP_INFO_BUILD_VERSION = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.build.version).toEqual('NA');
    });

    it('should return replace pipeline id with NA if undefined', async () => {
      delete process.env.APP_INFO_CI_PIPELINE_ID;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineId).toEqual('NA');
    });

    it('should return replace pipeline id with NA if blank', async () => {
      process.env.APP_INFO_CI_PIPELINE_ID = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineId).toEqual('NA');
    });

    it('should return replace pipeline internal id with NA if undefined', async () => {
      delete process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineInternalId).toEqual('NA');
    });

    it('should return replace pipeline internal id with NA if blank', async () => {
      process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineInternalId).toEqual('NA');
    });

    it('should return replace pipeline url with NA if undefined', async () => {
      delete process.env.APP_INFO_CI_PIPELINE_URL;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineUrl).toEqual('NA');
    });

    it('should return replace pipeline url with NA if blank', async () => {
      process.env.APP_INFO_CI_PIPELINE_URL = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.ci.pipelineUrl).toEqual('NA');
    });

    it('should return replace git branch with NA if undefined', async () => {
      delete process.env.APP_INFO_GIT_BRANCH;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.branch).toEqual('NA');
    });

    it('should return replace git branch with NA if blank', async () => {
      process.env.APP_INFO_GIT_BRANCH = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.branch).toEqual('NA');
    });

    it('should return replace commit sha with NA if undefined', async () => {
      delete process.env.APP_INFO_GIT_COMMIT_SHA;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.commit.sha).toEqual('NA');
    });

    it('should return replace commit sha with NA if blank', async () => {
      process.env.APP_INFO_GIT_COMMIT_SHA = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.commit.sha).toEqual('NA');
    });

    it('should return replace commit time with NA if undefined', async () => {
      delete process.env.APP_INFO_GIT_COMMIT_TIME;

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.commit.time).toEqual('NA');
    });

    it('should return replace commit time with NA if blank', async () => {
      process.env.APP_INFO_GIT_COMMIT_TIME = '';

      const observable = service.getInfo();

      const result = await firstValueFrom(observable);

      expect(result.git.commit.time).toEqual('NA');
    });
  });
});
