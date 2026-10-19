import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';

export class StreamInterceptor<T> implements NestInterceptor<T, T | void> {
  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<T | void> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const accept = req.headers['accept'] ?? '';

    /* — detect JSON request — */
    const wantsJson = accept.trim().startsWith('application/x-ndjson');
    if (wantsJson) {
      /* — NDJSON branch — */
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');

      next.handle().subscribe({
        next: (value) => res.write(JSON.stringify(value) + '\n'),
        error: (err) => {
          if (!res.headersSent) {
            res.status(err.status ?? err.statusCode ?? 500).json({
              errors: err.message ?? 'Internal error',
              statusCode: err.status ?? err.statusCode ?? 500,
            });
          }
          res.end();
        },
        complete: () => res.end(),
      });

      return of(undefined); // no body for Nest to serialise
    }
    // pass thorugh all other requests
    return next.handle();
  }
}
