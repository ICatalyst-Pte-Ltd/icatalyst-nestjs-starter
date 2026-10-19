import { HttpStatus, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import {
  createProxyMiddleware,
  fixRequestBody,
  RequestHandler,
  responseInterceptor,
} from 'http-proxy-middleware';
import { ProxyConfig } from './proxy.config.js';

export class AbstractProxyService<
  V1Object,
  V2Object,
  CreateDto,
  V1Create,
  UpdateDto,
  V1Update,
> {
  private readonly logger: Logger = new Logger(AbstractProxyService.name);
  private proxy: RequestHandler<Request, Response>;

  constructor(
    private readonly config: ProxyConfig,
    regex: RegExp | string,
    replacement: string,
    private readonly toV1Create: (createDto: CreateDto) => V1Create,
    private readonly toV1Update: (updateDto: UpdateDto) => V1Update,
    toV2Object: (object: V1Object) => V2Object,
    private readonly updateFindAllRequest: (request: Request) => void,
  ) {
    const pathRewrite = (path: string, req: Request): string => {
      // strip away the query parameters in the path as it will be rebuilt
      // and added back into the path
      const split = path.split('?');
      let replaced = split[0].replace(regex, replacement);
      if (!replaced.endsWith('/')) {
        replaced += '/';
      }
      if (req.query) {
        const queryString = Object.entries(req.query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        if (queryString) {
          replaced += `?${queryString}`;
        }
      }
      this.logger.debug({
        class: AbstractProxyService.name,
        method: pathRewrite.name,
        path,
        replaced,
      });
      return replaced;
    };
    const onProxyReq = (proxyReq: ClientRequest, req: Request) => {
      // NOTE: must call the fixRequestBody due to the use of bodyParser
      fixRequestBody(proxyReq, req);
      this.logger.log({
        class: AbstractProxyService.name,
        method: onProxyReq.name,
        message: 'Proxying request',
        from: `${req.method} ${req.protocol}://${req.hostname}:${req.socket.localPort}${req.originalUrl}`,
        to: `${proxyReq.method} ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
      });
    };
    const onProxyRes = responseInterceptor(async (buffer, proxyRes) => {
      if (
        proxyRes.statusCode == HttpStatus.OK ||
        proxyRes.statusCode === HttpStatus.CREATED
      ) {
        const content = JSON.parse(buffer.toString());
        const transformed = Array.isArray(content)
          ? content.map(toV2Object)
          : toV2Object(content);
        this.logger.debug({
          class: AbstractProxyService.name,
          method: onProxyRes.name,
          statusCode: proxyRes.statusCode,
          content,
          transformed,
        });
        return JSON.stringify(transformed);
      }
      this.logger.debug({
        class: AbstractProxyService.name,
        method: onProxyRes.name,
        statusCode: proxyRes.statusCode,
      });
      return buffer;
    });
    this.proxy = createProxyMiddleware({
      target: config.openApiUrl,
      // changeOrigin is needed for https target, otherwise it results in
      // the error ERR_TLS_CERT_ALTNAME_INVALID
      changeOrigin: true,
      on: {
        proxyReq: onProxyReq,
        proxyRes: onProxyRes,
      },
      pathRewrite,
      selfHandleResponse: true,
    });
  }

  create(
    createDto: CreateDto,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    // NOTE: due to the proxy implementation, the service does not return anything
    const body = this.toV1Create(createDto);
    this.logger.debug({
      class: AbstractProxyService.name,
      method: this.create.name,
      'request.body': request.body,
      body,
    });
    request.body = body;
    void this.proxy(request, response, next);
  }

  findAll(request: Request, response: Response, next: NextFunction): void {
    // NOTE: due to the proxy implementation, the service does not return anything
    this.logger.debug({
      class: AbstractProxyService.name,
      method: this.findAll.name,
      request: {
        params: request.params,
        query: request.query,
      },
    });
    this.updateFindAllRequest(request);
    void this.proxy(request, response, next);
  }

  findOne(request: Request, response: Response, next: NextFunction): void {
    // NOTE: due to the proxy implementation, the service does not return anything
    void this.proxy(request, response, next);
  }

  update(
    updateDto: UpdateDto,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    // NOTE: due to the proxy implementation, the service does not return anything
    const body = this.toV1Update(updateDto);
    this.logger.debug({
      class: AbstractProxyService.name,
      method: this.update.name,
      'request.body': request.body,
      body,
    });
    request.body = body;
    void this.proxy(request, response, next);
  }

  remove(request: Request, response: Response, next: NextFunction): void {
    // NOTE: due to the proxy implementation, the service does not return anything
    void this.proxy(request, response, next);
  }
}
