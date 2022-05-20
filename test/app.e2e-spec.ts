import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppConfig } from '../src/app.config';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma';

Logger.prototype.debug = jest.fn();
Logger.prototype.error = jest.fn();
Logger.prototype.log = jest.fn();
Logger.prototype.warn = jest.fn();

// NOTE: reuse the same instance of the PrismaService for all tests
//  because the PrismaService also manages connections to the database
const prisma = new PrismaService();

async function reset() {
  // reset the database
  await prisma.example.deleteMany();
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let config: AppConfig;

  beforeEach(async () => {
    await reset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    config = moduleFixture.get(AppConfig);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await reset();
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app.getHttpServer()).get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        details: {
          database: { status: 'up' },
        },
        error: {},
        info: {
          database: { status: 'up' },
        },
        status: 'ok',
      });
    });
  });

  describe('GET /info', () => {
    it('should return info', async () => {
      const response = await request(app.getHttpServer()).get('/info');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
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
        name: config.name,
        url: config.url,
      });
    });
  });

  // TODO: add your e2e tests for the other endpoints here
});
