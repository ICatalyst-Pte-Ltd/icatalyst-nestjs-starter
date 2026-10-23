import type { Mock } from 'vitest';
import { HttpService } from '@nestjs/axios';
import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { Readable } from 'node:stream';
import { firstValueFrom, of, throwError } from 'rxjs';
import { GotenbergConfig } from './gotenberg.config.js';
import { GotenbergService } from './gotenberg.service.js';
import { GotenbergHealthResponse } from './gotenberg.types.js';

function response<T>(data: T): AxiosResponse<T> {
  return { data } as AxiosResponse<T>;
}

describe(GotenbergService.name, () => {
  const url = 'http://localhost:4000';
  let service: GotenbergService;
  let get: Mock;
  let post: Mock;

  beforeEach(async () => {
    get = vi.fn();
    post = vi.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GotenbergService,
        { provide: GotenbergConfig, useValue: { url } },
        { provide: HttpService, useValue: { get, post } },
      ],
    }).compile();

    service = module.get(GotenbergService);
  });

  describe(GotenbergService.prototype.health.name, () => {
    it('should be up if Gotenberg is up', async () => {
      const data: GotenbergHealthResponse = {
        details: { chromium: { status: 'up', timestamp: 'timestamp' } },
        status: 'up',
      };
      get.mockReturnValue(of(response(data)));

      const result = await firstValueFrom(service.health());

      expect(result).toEqual({
        error: undefined,
        gotenberg: data,
        responseTimeInMilliseconds: expect.any(Number),
        status: 'up',
      });
      expect(get).toHaveBeenCalledWith(`${url}/health`);
    });

    it('should be down if Gotenberg is down', async () => {
      const data: GotenbergHealthResponse = {
        details: {
          chromium: { error: 'error', status: 'down', timestamp: 'timestamp' },
        },
        status: 'down',
      };
      get.mockReturnValue(of(response(data)));

      const result = await firstValueFrom(service.health());

      expect(result).toEqual({
        error: data,
        gotenberg: data,
        responseTimeInMilliseconds: expect.any(Number),
        status: 'down',
      });
    });

    it('should be down if the request fails', async () => {
      const error = new AxiosError(
        'Request failed',
        'ERR_BAD_RESPONSE',
        undefined,
        undefined,
        {
          headers: {},
          status: 503,
          statusText: 'Service Unavailable',
        } as AxiosResponse,
      );
      get.mockReturnValue(throwError(() => error));

      const result = await firstValueFrom(service.health());

      expect(result).toEqual({
        error: {
          code: 'ERR_BAD_RESPONSE',
          message: 'Request failed',
          statusCode: 503,
          statusText: 'Service Unavailable',
        },
        gotenberg: undefined,
        responseTimeInMilliseconds: expect.any(Number),
        status: 'down',
      });
    });
  });

  describe('conversions', () => {
    let stream: Readable;

    beforeEach(() => {
      stream = Readable.from(['%PDF']);
      post.mockReturnValue(
        of({
          data: stream,
          headers: new AxiosHeaders(),
        } as AxiosResponse),
      );
    });

    function postedForm(): FormData {
      return post.mock.lastCall![1] as FormData;
    }

    describe(GotenbergService.prototype.convertUrl.name, () => {
      it('should post the URL and page properties to Gotenberg', async () => {
        const result = await firstValueFrom(
          service.convertUrl('https://example.com', {
            landscape: true,
            marginTop: undefined,
            scale: 0.5,
          }),
        );

        expect(post).toHaveBeenCalledWith(
          `${url}/forms/chromium/convert/url`,
          expect.any(FormData),
          { responseType: 'stream' },
        );
        const form = postedForm();
        expect(form.get('url')).toBe('https://example.com');
        expect(form.get('landscape')).toBe('true');
        expect(form.get('scale')).toBe('0.5');
        expect(form.has('marginTop')).toBe(false);
        expect(result).toBeInstanceOf(StreamableFile);
        expect(result.getStream()).toBe(stream);
        expect(result.getHeaders()).toEqual(
          expect.objectContaining({
            disposition: 'attachment; filename="document.pdf"',
            type: 'application/pdf',
          }),
        );
      });
    });

    describe(GotenbergService.prototype.convertHtml.name, () => {
      it('should post the HTML as index.html to Gotenberg', async () => {
        const result = await firstValueFrom(
          service.convertHtml('<h1>Hello</h1>', { fileName: 'hello.pdf' }),
        );

        expect(post).toHaveBeenCalledWith(
          `${url}/forms/chromium/convert/html`,
          expect.any(FormData),
          { responseType: 'stream' },
        );
        const file = postedForm().get('files') as File;
        expect(file.name).toBe('index.html');
        expect(file.type).toBe('text/html');
        await expect(file.text()).resolves.toBe('<h1>Hello</h1>');
        expect(postedForm().has('fileName')).toBe(false);
        expect(result.getHeaders()).toEqual(
          expect.objectContaining({
            disposition: 'attachment; filename="hello.pdf"',
          }),
        );
      });

      it('should use the default options', async () => {
        await firstValueFrom(service.convertHtml('<h1>Hello</h1>'));

        expect([...postedForm().keys()]).toEqual(['files']);
      });
    });
  });
});
