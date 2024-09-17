import { Controller, Get, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
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
  let server: App;

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

  it('should use the environment variable with single value', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'https://example.com';

    const response = await request(server).get('/');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'access-control-allow-origin': 'https://example.com',
      }),
    );
  });

  it('should use the environment variable with multiple values', async () => {
    process.env.CORS_ALLOWED_ORIGINS =
      'https://example.com,https://example1.com';

    const response = await request(server)
      .get('/')
      .set('origin', 'https://example1.com');

    expect(response.headers).toEqual(
      expect.objectContaining({
        'access-control-allow-origin': 'https://example1.com',
      }),
    );
  });

  it('should return an error if CORS_ALLOWED_ORIGINS is undefined', async () => {
    delete process.env.CORS_ALLOWED_ORIGINS;
    Logger.prototype.error = jest.fn();

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: 'Internal server error',
      statusCode: 500,
    });
  });
});
