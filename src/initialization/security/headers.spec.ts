import { Controller, Get } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { setSecurityHeaders } from './headers.js';

@Controller()
export class TestController {
  @Get()
  getHello(): string {
    return 'test';
  }
}

describe('Security Headers', () => {
  let server: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setSecurityHeaders(app);
    await app.init();
    server = app.getHttpServer();
  });

  it.each([
    {
      header: 'content-security-policy',
      value:
        "connect-src 'self';default-src 'none';frame-ancestors 'none';img-src 'self' data:;script-src-elem 'self';style-src 'self' 'sha256-/jDKvbQ8cdux+c5epDIqkjHbXDaIY8RucT1PmAe8FG4=' 'sha256-ezdv1bOGcoOD7FKudKN0Y2Mb763O6qVtM8LT2mtanIU=' 'sha256-eaPyLWVdqMc60xuz5bTp2yBRgVpQSoUggte1+40ONPU='",
    },
    {
      header: 'strict-transport-security',
      value: 'max-age=31536000; includeSubDomains',
    },
    { header: 'x-content-type-options', value: 'nosniff' },
    { header: 'x-frame-options', value: 'DENY' },
    { header: 'x-xss-protection', value: '0' },
  ])('should have "$header" set to "$value"', async ({ header, value }) => {
    await request(server).get('/').expect(header, value);
  });
});
