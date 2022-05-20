import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig } from '../app.config';
import { InfoService } from './info.service';

function buildInfo({
  version = '1.0.0',
  pipelineId = '1234',
  pipelineInternalId = '1',
  pipelineUrl = 'https://localhost/pipeline',
  branch = 'branch',
  sha = '123456790abcdef',
  time = '2021-01-01T00:00:00+00:00',
  name = 'app-name',
  url = 'https://localhost:3000',
}) {
  return {
    build: {
      version,
    },
    ci: {
      pipelineId,
      pipelineInternalId,
      pipelineUrl,
    },
    git: {
      branch,
      commit: {
        sha,
        time,
      },
    },
    name,
    url,
  };
}

describe('InfoService', () => {
  const env = { ...process.env };
  let service: InfoService;

  beforeEach(async () => {
    process.env = { ...env };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfoService,
        {
          provide: AppConfig,
          useValue: { name: 'app-name', url: 'https://localhost:3000' },
        },
      ],
    }).compile();

    service = module.get<InfoService>(InfoService);
  });

  afterAll(() => {
    process.env = { ...env };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInfo', () => {
    beforeEach(() => {
      const info = buildInfo({});
      process.env.APP_INFO_BUILD_VERSION = info.build.version;
      process.env.APP_INFO_CI_PIPELINE_ID = info.ci.pipelineId;
      process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID = info.ci.pipelineInternalId;
      process.env.APP_INFO_CI_PIPELINE_URL = info.ci.pipelineUrl;
      process.env.APP_INFO_GIT_BRANCH = info.git.branch;
      process.env.APP_INFO_GIT_COMMIT_SHA = info.git.commit.sha;
      process.env.APP_INFO_GIT_COMMIT_TIME = info.git.commit.time;
    });

    it('should return info', () => {
      const info = service.getInfo();

      expect(info).toEqual(buildInfo({}));
    });

    it('should return replace build version with NA if undefined', () => {
      delete process.env.APP_INFO_BUILD_VERSION;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ version: 'NA' }));
    });

    it('should return replace build version with NA if blank', () => {
      process.env.APP_INFO_BUILD_VERSION = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ version: 'NA' }));
    });

    it('should return replace pipeline id with NA if undefined', () => {
      delete process.env.APP_INFO_CI_PIPELINE_ID;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineId: 'NA' }));
    });

    it('should return replace pipeline id with NA if blank', () => {
      process.env.APP_INFO_CI_PIPELINE_ID = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineId: 'NA' }));
    });

    it('should return replace pipeline internal id with NA if undefined', () => {
      delete process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineInternalId: 'NA' }));
    });

    it('should return replace pipeline internal id with NA if blank', () => {
      process.env.APP_INFO_CI_PIPELINE_INTERNAL_ID = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineInternalId: 'NA' }));
    });

    it('should return replace pipeline url with NA if undefined', () => {
      delete process.env.APP_INFO_CI_PIPELINE_URL;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineUrl: 'NA' }));
    });

    it('should return replace pipeline url with NA if blank', () => {
      process.env.APP_INFO_CI_PIPELINE_URL = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ pipelineUrl: 'NA' }));
    });

    it('should return replace git branch with NA if undefined', () => {
      delete process.env.APP_INFO_GIT_BRANCH;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ branch: 'NA' }));
    });

    it('should return replace git branch with NA if blank', () => {
      process.env.APP_INFO_GIT_BRANCH = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ branch: 'NA' }));
    });

    it('should return replace commit sha with NA if undefined', () => {
      delete process.env.APP_INFO_GIT_COMMIT_SHA;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ sha: 'NA' }));
    });

    it('should return replace commit sha with NA if blank', () => {
      process.env.APP_INFO_GIT_COMMIT_SHA = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ sha: 'NA' }));
    });

    it('should return replace commit time with NA if undefined', () => {
      delete process.env.APP_INFO_GIT_COMMIT_TIME;

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ time: 'NA' }));
    });

    it('should return replace commit time with NA if blank', () => {
      process.env.APP_INFO_GIT_COMMIT_TIME = '';

      const info = service.getInfo();

      expect(info).toEqual(buildInfo({ time: 'NA' }));
    });
  });
});
