import { Controller, Get, HttpServer, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import each from 'jest-each';
import { setCors } from './cors';

@Controller()
export class TestController {
  @Get()
  getHello(): string {
    return 'test';
  }
}

describe('CORS', () => {
  const env = { ...process.env };
  let server: HttpServer;

  beforeEach(async () => {
    process.env = { ...env };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setCors(app);
    await app.init();
    server = app.getHttpServer();
  });

  it('should use the environment variable', async () => {
    process.env.APP_REGISTRATION_URL = 'https://example.com';

    const response = await request(server).get('/');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'access-control-allow-origin': 'https://example.com',
      }),
    );
  });
});
