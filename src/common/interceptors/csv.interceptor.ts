import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { from, mergeMap, Observable, of } from 'rxjs';
import { VersionNotAcceptableException } from './interceptors.exceptions.js';
import { Request, Response } from 'express';
import { Transform } from '@json2csv/node';

export abstract class CSVInterceptor<T, R> implements NestInterceptor<
  T,
  T | void
> {
  protected constructor(protected readonly fileName: string) {}

  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<T | void> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const accept = req.headers['accept'] ?? '';

    /* — detect CSV request — */
    const wantsCsv = accept.trim().startsWith('text/csv');

    if (wantsCsv) {
      /* CSV branch (Accept: text/csv;version=2) */
      const version = Number(accept.match(/\bversion=(\d+)/i)?.[1]);
      if (version !== 2) throw new VersionNotAcceptableException();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${this.fileName}.csv"`,
      );

      /* json2csv streaming transform */
      const parserOpts = {
        header: true,
        flatten: true,
      };
      const csvTransform = new Transform(parserOpts, {}, { objectMode: true });

      csvTransform.pipe(res);

      /* subscribe & write CSV rows */
      next
        .handle()
        .pipe(mergeMap((v) => from(this.transform(v))))
        .subscribe({
          next: (row) => csvTransform.write(row),
          error: (err) => {
            csvTransform.destroy();
            if (!res.headersSent) {
              res.status(err.status ?? err.statusCode ?? 500).json({
                errors: err.message ?? 'Internal error',
                statusCode: err.status ?? err.statusCode ?? 500,
              });
            }
          },
          complete: () => csvTransform.end(),
        });

      // tell Nest there's nothing else to serialise
      return of(undefined);
    }
    // pass through all other requests
    return next.handle();
  }

  /** Convert one domain object into 0‑N flat rows */
  protected abstract transform(data: T): ReadonlyArray<R>;
}
