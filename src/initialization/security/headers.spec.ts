import { Controller, Get, HttpServer } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import each from 'jest-each';
import request from 'supertest';
import { setSecurityHeaders } from './headers';

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
    ${'content-security-policy'} | ${"connect-src 'self';default-src 'none';frame-ancestors 'none';img-src 'self' data:;script-src-elem 'self';style-src 'self' 'sha256-/jDKvbQ8cdux+c5epDIqkjHbXDaIY8RucT1PmAe8FG4=' 'sha256-ezdv1bOGcoOD7FKudKN0Y2Mb763O6qVtM8LT2mtanIU=' 'sha256-eaPyLWVdqMc60xuz5bTp2yBRgVpQSoUggte1+40ONPU='"}
    ${'strict-transport-security'} | ${'max-age=31536000; includeSubDomains'}
    ${'x-content-type-options'} | ${'nosniff'}
    ${'x-frame-options'} | ${'DENY'}
    ${'x-xss-protection'} | ${'0'}
  `.it(`should have "$header" set to "$value"`, ({ header, value }) => {
    return request(server).get('/').expect(header, value);
  });
});
