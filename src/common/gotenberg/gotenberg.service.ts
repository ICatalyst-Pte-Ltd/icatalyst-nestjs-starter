import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import type { Readable } from 'node:stream';
import { catchError, map, Observable, of } from 'rxjs';
import { transformError } from '../axios/index.js';
import { GotenbergConfig } from './gotenberg.config.js';
import { DEFAULT_FILE_NAME } from './gotenberg.constants.js';
import {
  ConvertOptions,
  GotenbergHealth,
  GotenbergHealthResponse,
  PageProperties,
} from './gotenberg.types.js';

/**
 * A client of the Gotenberg API for converting documents to PDF.
 *
 * @see https://gotenberg.dev/docs/routes
 */
@Injectable()
export class GotenbergService {
  readonly #logger = new Logger(GotenbergService.name);

  constructor(
    private readonly config: GotenbergConfig,
    private readonly http: HttpService,
  ) {}

  /**
   * Convert an HTML document to PDF.
   *
   * @param html the HTML document.
   * @param options the page properties and file name.
   * @returns the PDF.
   */
  convertHtml(
    html: string,
    { fileName, ...properties }: ConvertOptions = {},
  ): Observable<StreamableFile> {
    const form = this.createForm(properties);
    form.append('files', new Blob([html], { type: 'text/html' }), 'index.html');
    return this.convert('forms/chromium/convert/html', form, fileName);
  }

  /**
   * Convert a web page to PDF.
   *
   * @param url the URL of the web page.
   * @param options the page properties and file name.
   * @returns the PDF.
   */
  convertUrl(
    url: string,
    { fileName, ...properties }: ConvertOptions = {},
  ): Observable<StreamableFile> {
    const form = this.createForm(properties);
    form.append('url', url);
    return this.convert('forms/chromium/convert/url', form, fileName);
  }

  health(): Observable<GotenbergHealth> {
    const start = performance.now();
    const url = `${this.config.url}/health`;
    this.#logger.debug({ method: this.health.name, url });
    return this.http.get<GotenbergHealthResponse>(url).pipe(
      map((response) => {
        const gotenberg = response.data;
        return {
          end: performance.now(),
          error: gotenberg.status === 'up' ? undefined : gotenberg,
          gotenberg,
        };
      }),
      catchError((error) => {
        return of({
          end: performance.now(),
          error: transformError(error),
          gotenberg: undefined,
        });
      }),
      map(({ end, error, gotenberg }) => {
        return {
          error,
          gotenberg,
          responseTimeInMilliseconds: end - start,
          status: error ? 'down' : 'up',
        };
      }),
    );
  }

  private createForm(properties: PageProperties): FormData {
    const form = new FormData();
    Object.entries(properties)
      .filter(([, value]) => value !== undefined)
      .forEach(([key, value]) => {
        form.append(key, `${value}`);
      });
    return form;
  }

  private convert(
    route: string,
    form: FormData,
    fileName = DEFAULT_FILE_NAME,
  ): Observable<StreamableFile> {
    const url = `${this.config.url}/${route}`;
    this.#logger.debug({ method: this.convert.name, url });
    return this.http.post<Readable>(url, form, { responseType: 'stream' }).pipe(
      map((response) => {
        return new StreamableFile(response.data, {
          disposition: `attachment; filename="${fileName}"`,
          type: 'application/pdf',
        });
      }),
    );
  }
}
