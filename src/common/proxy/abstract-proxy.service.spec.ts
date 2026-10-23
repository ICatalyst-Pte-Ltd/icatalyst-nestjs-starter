import type { Mock } from 'vitest';
import { HttpStatus, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { ClientRequest, IncomingMessage } from 'node:http';
import * as hpm from 'http-proxy-middleware';
import { AbstractProxyService } from './abstract-proxy.service.js';

vi.mock('http-proxy-middleware');

interface TestObject {
  id: string;
}

describe('proxy', () => {
  describe(AbstractProxyService.name, () => {
    let request: Request;
    let response: Response;
    let next: NextFunction;
    let toV1Create: (createDto: TestObject) => TestObject;
    let toV1Update: (updateDto: TestObject) => TestObject;
    let toV2Object: (object: TestObject) => TestObject;
    let updateFindAllRequest: (request: Request) => void;
    let proxy: ReturnType<typeof hpm.createProxyMiddleware>;
    let service: AbstractProxyService<
      TestObject,
      TestObject,
      TestObject,
      TestObject,
      TestObject,
      TestObject
    >;

    beforeEach(() => {
      request = { id: randomUUID() } as unknown as Request;
      response = { id: randomUUID() } as unknown as Response;
      next = vi.fn();

      toV1Create = vi.fn();
      toV1Update = vi.fn();
      toV2Object = vi.fn();
      updateFindAllRequest = vi.fn();

      proxy = vi.fn() as unknown as ReturnType<
        typeof hpm.createProxyMiddleware
      >;

      vi.mocked(hpm.createProxyMiddleware).mockReturnValue(proxy);
      vi.mocked(hpm.responseInterceptor).mockImplementation(
        (interceptor) => interceptor as never,
      );

      service = new AbstractProxyService(
        { openApiUrl: 'https://localhost:9000' },
        /regex/,
        'replacement',
        toV1Create,
        toV1Update,
        toV2Object,
        updateFindAllRequest,
      );

      Logger.prototype.debug = vi.fn();
      Logger.prototype.error = vi.fn();
      Logger.prototype.log = vi.fn();
      Logger.prototype.warn = vi.fn();
    });

    describe('constructor', () => {
      it('should instantiate', () => {
        expect(hpm.createProxyMiddleware).toHaveBeenCalledWith(
          expect.objectContaining({
            target: 'https://localhost:9000',
            selfHandleResponse: true,
          }),
        );
      });
    });

    describe('options', () => {
      type Options = {
        on: {
          proxyReq: (proxyReq: ClientRequest, req: Request) => void;
          proxyRes: (
            buffer: Buffer,
            proxyRes: IncomingMessage,
          ) => Promise<Buffer | string>;
        };
        pathRewrite: (path: string, req: Request) => string;
      };
      let options: Options;

      beforeEach(() => {
        options = vi.mocked(hpm.createProxyMiddleware).mock
          .lastCall![0] as unknown as Options;
      });

      describe('pathRewrite', () => {
        it.each([
          {
            description: 'replace the path and append a trailing slash',
            expected: '/replacement/',
            path: '/regex',
            query: {},
          },
          {
            description: 'not append a trailing slash if there is one',
            expected: '/replacement/',
            path: '/regex/',
            query: undefined,
          },
          {
            description: 'rebuild the query string from the request',
            expected: '/replacement/?a=1&b=2',
            path: '/regex?ignored=true',
            query: { a: '1', b: '2' },
          },
        ])('$#: should $description', ({ expected, path, query }) => {
          const result = options.pathRewrite(path, { query } as Request);

          expect(result).toBe(expected);
        });
      });

      describe('proxyReq', () => {
        it('should fix the request body and log the request', () => {
          const proxyReq = {
            host: 'localhost:9000',
            method: 'GET',
            path: '/path',
            protocol: 'https:',
          } as ClientRequest;
          const req = {
            hostname: 'localhost',
            method: 'GET',
            originalUrl: '/original',
            protocol: 'http',
            socket: { localPort: 3000 },
          } as unknown as Request;
          const log = vi.spyOn(Logger.prototype, 'log');

          options.on.proxyReq(proxyReq, req);

          expect(hpm.fixRequestBody).toHaveBeenCalledWith(proxyReq, req);
          expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
              from: 'GET http://localhost:3000/original',
              to: 'GET https://localhost:9000/path',
            }),
          );
        });
      });

      describe('proxyRes', () => {
        it.each([
          {
            content: { id: 'a' },
            expected: { id: 'A' },
            statusCode: HttpStatus.OK,
          },
          {
            content: [{ id: 'a' }, { id: 'b' }],
            expected: [{ id: 'A' }, { id: 'B' }],
            statusCode: HttpStatus.CREATED,
          },
        ])(
          '$#: should transform the content if the status code is $statusCode',
          async ({ content, expected, statusCode }) => {
            (toV2Object as Mock).mockImplementation((object: TestObject) => ({
              id: object.id.toUpperCase(),
            }));
            const buffer = Buffer.from(JSON.stringify(content));

            const result = await options.on.proxyRes(buffer, {
              statusCode,
            } as IncomingMessage);

            expect(result).toBe(JSON.stringify(expected));
          },
        );

        it('should return the original buffer for other status codes', async () => {
          const buffer = Buffer.from('not found');

          const result = await options.on.proxyRes(buffer, {
            statusCode: HttpStatus.NOT_FOUND,
          } as IncomingMessage);

          expect(result).toBe(buffer);
          expect(toV2Object).not.toHaveBeenCalled();
        });
      });
    });

    describe('create', () => {
      it('should call the proxy', () => {
        const transformed = { id: randomUUID() };
        (toV1Create as Mock).mockReturnValue(transformed);
        const createDto = { id: randomUUID() };

        service.create(createDto, request, response, next);

        expect(toV1Create).toHaveBeenCalledWith(createDto);
        expect(request.body).toBe(transformed);
        expect(proxy).toHaveBeenCalledWith(request, response, next);
      });
    });

    describe('findAll', () => {
      it('should call the proxy', () => {
        const query = { id: randomUUID() };
        (updateFindAllRequest as Mock).mockImplementation(
          (request: Request) => {
            request.query = query;
          },
        );

        service.findAll(request, response, next);

        expect(updateFindAllRequest).toHaveBeenCalledWith(request);
        expect(request.query).toBe(query);
        expect(proxy).toHaveBeenCalledWith(request, response, next);
      });
    });

    describe('findOne', () => {
      it('should call the proxy', () => {
        service.findOne(request, response, next);

        expect(proxy).toHaveBeenCalledWith(request, response, next);
      });
    });

    describe('update', () => {
      it('should call the proxy', () => {
        const transformed = { id: randomUUID() };
        (toV1Update as Mock).mockReturnValue(transformed);
        const updateDto = { id: randomUUID() };

        service.update(updateDto, request, response, next);

        expect(toV1Update).toHaveBeenCalledWith(updateDto);
        expect(request.body).toBe(transformed);
        expect(proxy).toHaveBeenCalledWith(request, response, next);
      });
    });

    describe('remove', () => {
      it('should call the proxy', () => {
        service.remove(request, response, next);

        expect(proxy).toHaveBeenCalledWith(request, response, next);
      });
    });
  });
});
