import { Controller, Get, HttpServer } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { setSecurityHeaders } from './headers';
import request from 'supertest';
import each from 'jest-each';

@Controller()
export class TestController {
  @Get()
  getHello(): string {
    return 'test';
  }
}

describe('Security Headers', () => {
  let server: HttpServer;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setSecurityHeaders(app);
    await app.init();
    server = app.getHttpServer();
  });

  each`
    header | value
    ${'content-security-policy'} | ${"default-src 'none';frame-ancestors 'none'"}
    ${'strict-transport-security'} | ${'max-age=31536000; includeSubDomains'}
    ${'x-content-type-options'} | ${'nosniff'}
    ${'x-frame-options'} | ${'DENY'}
    ${'x-xss-protection'} | ${'0'}
  `.it(`should have "$header" set to "$value"`, ({ header, value }) => {
    return request(server).get('/').expect(header, value);
  });
});
