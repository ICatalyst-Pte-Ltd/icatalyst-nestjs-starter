import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { enableSwagger } from './swagger';

describe(enableSwagger.name, () => {
  let app: INestApplication;
  let logger: Logger;
  let document: OpenAPIObject;

  beforeEach(() => {
    app = {} as INestApplication;
    logger = {} as Logger;
    logger.log = jest.fn();
    document = {} as OpenAPIObject;
    SwaggerModule.createDocument = jest.fn().mockReturnValue(document);
    SwaggerModule.setup = jest.fn();
  });

  it('should initialize Swagger', () => {
    const result = enableSwagger(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toBeCalledWith('Enabling Swagger');
    expect(SwaggerModule.createDocument).toBeCalledWith(
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
    expect(SwaggerModule.setup).toBeCalledWith('api', app, document);
  });
});
