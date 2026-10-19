import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import request from 'supertest';
import { AppConfig } from '../src/app.config.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/common/prisma/index.js';
import { PrismaAdapterFactory } from '../src/common/prisma/prisma-adapter.factory.js';
import { PrismaConfig } from '../src/common/prisma/prisma.config.js';

Logger.prototype.debug = vi.fn();
Logger.prototype.error = vi.fn();
Logger.prototype.log = vi.fn();
Logger.prototype.warn = vi.fn();

// NOTE: reuse the same instance of the PrismaService for all tests
//  because the PrismaService also manages connections to the database
const prisma = new PrismaService(
  new PrismaConfig(),
  new PrismaAdapterFactory(),
);

async function reset() {
  // reset the database
  await prisma.example.deleteMany();
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let config: AppConfig;
  let cache: Cache;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await reset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    config = moduleFixture.get(AppConfig);
    cache = moduleFixture.get(CACHE_MANAGER);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // NOTE: the connections to Redis must be closed, otherwise the tests will hang
    await Promise.all(cache.stores.map((store) => store.disconnect()));
    // NOTE: BullMQ processors prevent the tests from terminating unless the app is closed
    await app.close();
  });

  afterAll(async () => {
    await reset();
    await prisma.$disconnect();
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app.getHttpServer()).get('/health');

      const status = {
        message: 'See /info endpoint for more details',
        status: 'up',
      };
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        details: { cache: status, database: status },
        error: {},
        info: { cache: status, database: status },
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
        extensions: {
          cache: {
            stores: [
              {
                responseTimeInMilliseconds: expect.any(Number),
                status: 'up',
                store: 'KeyvRedis',
              },
            ],
          },
          database: {
            responseTimeInMilliseconds: expect.any(Number),
            status: 'up',
          },
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
