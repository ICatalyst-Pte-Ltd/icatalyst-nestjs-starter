import { Controller, Get, HttpServer, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
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
    process.env.APP_URL = 'https://example.com';

    const response = await request(server).get('/');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'access-control-allow-origin': 'https://example.com',
      }),
    );
  });

  it('should return an error if APP_URL is undefined', async () => {
    delete process.env.APP_URL;
    Logger.prototype.error = jest.fn();

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: 500,
    });
  });
});
