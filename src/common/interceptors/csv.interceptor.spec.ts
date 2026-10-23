import type { Mock } from 'vitest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of, throwError } from 'rxjs';
import { CSVInterceptor } from './csv.interceptor.js';
import { Test, TestingModule } from '@nestjs/testing';
import { VersionNotAcceptableException } from './interceptors.exceptions.js';
import { Response } from 'express';
import { PassThrough } from 'node:stream';
import { setImmediate } from 'node:timers/promises';

interface Scenario {
  description: string;
  acceptHeader?: string;
  expectThrow?: boolean;
  expectCsv?: boolean;
}

class TestInterceptor extends CSVInterceptor<string, Record<string, unknown>> {
  constructor() {
    super('test');
  }
  protected transform(data: string) {
    return [{ col1: data }];
  }
}

describe(CSVInterceptor.name, () => {
  let interceptor: TestInterceptor;
  let context: ExecutionContext;
  let next: CallHandler<string>;
  let req: { headers: { [key: string]: string } };
  let res: Response & NodeJS.WritableStream;
  let setHeader: Mock;
  let status: Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestInterceptor],
    }).compile();

    interceptor = module.get(TestInterceptor);

    req = { headers: {} };

    const stream = new PassThrough({ objectMode: true });
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
      description: 'pass through when "text/csv" is not first',
      acceptHeader: 'application/json, text/csv',
      expectCsv: false,
    },
    {
      description: 'throw when "text/csv" without version',
      acceptHeader: 'text/csv',
      expectThrow: true,
    },
    {
      description: 'throw when "text/csv; version=1"',
      acceptHeader: 'text/csv; version=1',
      expectThrow: true,
    },
    {
      description: 'stream CSV on "text/csv; version=2"',
      acceptHeader: 'text/csv; version=2',
      expectCsv: true,
    },
  ];

  describe(CSVInterceptor.prototype.intercept.name, () => {
    scenarios.forEach(
      ({ description, acceptHeader, expectThrow, expectCsv }) => {
        it(`should ${description}`, async () => {
          if (acceptHeader) req.headers.accept = acceptHeader;

          const payload = 'hello world';
          (next.handle as Mock).mockReturnValue(of(payload));

          if (expectThrow) {
            expect(() => interceptor.intercept(context, next)).toThrow(
              VersionNotAcceptableException,
            );
            return;
          }

          if (!expectCsv) {
            const result = await firstValueFrom(
              interceptor.intercept(context, next),
            );
            expect(result).toBe(payload);
          } else {
            interceptor.intercept(context, next);
            await setImmediate();

            expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
            expect(setHeader).toHaveBeenCalledWith(
              'Content-Disposition',
              'attachment; filename="test.csv"',
            );
            expect(res.write).toHaveBeenCalled();
            expect(res.end).toHaveBeenCalled();
          }
        });
      },
    );

    it('should pass through requests without an Accept header', async () => {
      const payload = 'hello world';
      (next.handle as Mock).mockReturnValue(of(payload));

      const result = await firstValueFrom(interceptor.intercept(context, next));

      expect(result).toBe(payload);
      expect(setHeader).not.toHaveBeenCalled();
    });

    it('should use the statusCode and a default message of the error', async () => {
      req.headers.accept = 'text/csv; version=2';
      const err = { statusCode: 400 };
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      interceptor.intercept(context, next);
      await setImmediate();

      expect(status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'Internal error',
        statusCode: 400,
      });
    });

    it('should not send JSON on error if the headers are already sent', async () => {
      req.headers.accept = 'text/csv; version=2';
      Object.defineProperty(res, 'headersSent', { value: true });
      (next.handle as Mock).mockReturnValue(
        throwError(() => new Error('bang')),
      );

      interceptor.intercept(context, next);
      await setImmediate();

      expect(status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    // error-handling tests -----
    it('should destroy transform and send custom-status JSON on error', async () => {
      req.headers.accept = 'text/csv; version=2';
      const err = { status: 418, message: 'teapot' };
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      interceptor.intercept(context, next);
      await setImmediate();

      expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="test.csv"',
      );
      expect(status).toHaveBeenCalledWith(418);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'teapot',
        statusCode: 418,
      });
    });

    it('should destroy transform and send 500 JSON on error without status', async () => {
      req.headers.accept = 'text/csv; version=2';
      const err = new Error('bang');
      (next.handle as Mock).mockReturnValue(throwError(() => err));

      interceptor.intercept(context, next);
      await setImmediate();

      expect(status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: 'bang',
        statusCode: 500,
      });
    });
  });
});
