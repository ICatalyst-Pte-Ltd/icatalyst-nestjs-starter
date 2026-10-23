import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { firstValueFrom, of, throwError } from 'rxjs';
import { StreamInterceptor } from './stream.interceptor.js';
import { Response } from 'express';
import { PassThrough } from 'node:stream';
import { setImmediate } from 'node:timers/promises';

interface Scenario {
  description: string;
  acceptHeader?: string;
  expectJson?: boolean;
}

describe(StreamInterceptor.name, () => {
  let interceptor: StreamInterceptor<unknown>;
  let context: ExecutionContext;
  let next: CallHandler<unknown>;
  let req: { headers: { [key: string]: string } };
  let res: Response & NodeJS.WritableStream;
  let setHeader: Mock;
  let status: Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamInterceptor],
    }).compile();

    interceptor = module.get(StreamInterceptor);

    req = { headers: {} };

    const stream = new PassThrough();
    res = stream as unknown as Response & NodeJS.WritableStream;

    vi.spyOn(stream, 'write');
    vi.spyOn(stream, 'end');

    setHeader = vi.fn();
    status = vi.fn().mockReturnThis();
    res.setHeader = setHeader;
    res.status = status;
    res.json = vi.fn();

    context = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ExecutionContext;

    next = { handle: vi.fn() };
  });

  const scenarios: Array<Scenario> = [
    {
      description: 'pass through non‑NDJSON requests',
      acceptHeader: 'application/json',
      expectJson: false,
    },
    {
      description: 'stream NDJSON when header starts with application/x-ndjson',
      acceptHeader: 'application/x-ndjson',
      expectJson: true,
    },
  ];

  describe(StreamInterceptor.prototype.intercept.name, () => {
    // existing scenario tests
    scenarios.forEach(({ description, acceptHeader, expectJson }) => {
      it(`should ${description}`, async () => {
        if (acceptHeader) req.headers.accept = acceptHeader;
        const payload = { foo: 'bar' };
        (next.handle as Mock).mockReturnValue(of(payload));

        const result = await firstValueFrom(
          interceptor.intercept(context, next),
        );

        if (!expectJson) {
          expect(result).toBe(payload);
        } else {
          expect(result).toBeUndefined();
          expect(setHeader).toHaveBeenCalledWith(
            'Content-Type',
            'application/x-ndjson',
          );
          expect(setHeader).toHaveBeenCalledWith(
            'Transfer-Encoding',
            'chunked',
          );
          expect(setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
          expect(res.write).toHaveBeenCalledWith(
            JSON.stringify(payload) + '\n',
          );
          expect(res.end).toHaveBeenCalled();
        }
      });
    });

    it('should pass through requests without an Accept header', async () => {
      const payload = { foo: 'bar' };
      (next.handle as Mock).mockReturnValue(of(payload));

      const result = await firstValueFrom(interceptor.intercept(context, next));

      expect(result).toBe(payload);
      expect(setHeader).not.toHaveBeenCalled();
    });

    it('should use the statusCode and a default message of the error', async () => {
      req.headers.accept = 'application/x-ndjson';
      const err = { statusCode: 400 };
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      await firstValueFrom(interceptor.intercept(context, next));
      await setImmediate();

      expect(status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'Internal error',
        statusCode: 400,
      });
      expect(res.end).toHaveBeenCalled();
    });

    it('should only end the stream on error if the headers are already sent', async () => {
      req.headers.accept = 'application/x-ndjson';
      Object.defineProperty(res, 'headersSent', { value: true });
      (next.handle as Mock).mockReturnValue(
        throwError(() => new Error('oops')),
      );

      await firstValueFrom(interceptor.intercept(context, next));
      await setImmediate();

      expect(status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(res.end).toHaveBeenCalled();
    });

    // error‐handling tests
    it('should send custom‐status JSON and end stream on error', async () => {
      req.headers.accept = 'application/x-ndjson';
      const err = { status: 418, message: 'teapot' };
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      const result = await firstValueFrom(interceptor.intercept(context, next));
      // wait for internal error callback
      await setImmediate();

      expect(result).toBeUndefined();
      expect(setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/x-ndjson',
      );
      expect(status).toHaveBeenCalledWith(418);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'teapot',
        statusCode: 418,
      });
      expect(res.end).toHaveBeenCalled();
    });

    it('should send 500 JSON and end stream on error without status', async () => {
      req.headers.accept = 'application/x-ndjson';
      const err = new Error('oops');
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      const result = await firstValueFrom(interceptor.intercept(context, next));
      await setImmediate();

      expect(result).toBeUndefined();
      expect(status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'oops',
        statusCode: 500,
      });
      expect(res.end).toHaveBeenCalled();
    });
  });
});
