import type { Mock } from 'vitest';
import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { enableSwagger } from './swagger.js';

describe(enableSwagger.name, () => {
  let app: INestApplication;
  let createDocument: Mock;
  let document: OpenAPIObject;
  let log: Mock;
  let logger: Logger;
  let setup: Mock;

  beforeEach(() => {
    app = {} as INestApplication;
    log = vi.fn();
    logger = { log } as unknown as Logger;
    document = {} as OpenAPIObject;
    createDocument = vi.fn().mockReturnValue(document);
    setup = vi.fn();
    SwaggerModule.createDocument = createDocument;
    SwaggerModule.setup = setup;
  });

  it('should initialize Swagger', () => {
    const result = enableSwagger(app, logger);

    expect(result).toBe(app);
    expect(log).toBeCalledWith('Enabling Swagger');
    expect(createDocument).toBeCalledWith(
      app,
      expect.objectContaining({
        components: {
          securitySchemes: {
            bearer: { bearerFormat: 'JWT', scheme: 'bearer', type: 'http' },
          },
        },
        info: {
          contact: {},
          description: 'The APIs for the SenseMaker backend',
          title: 'SenseMaker APIs',
          version: '1.0',
        },
        openapi: '3.0.0',
        servers: [
          {
            description: undefined,
            url: 'http://localhost:3000',
            variables: undefined,
          },
        ],
        tags: [],
      }),
    );
    expect(setup).toBeCalledWith('api', app, document, {
      swaggerOptions: { tagsSorter: 'alpha' },
    });
  });
});
