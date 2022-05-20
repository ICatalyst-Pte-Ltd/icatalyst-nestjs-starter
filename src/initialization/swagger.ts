import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function enableSwagger(
  app: INestApplication,
  logger: Logger,
): INestApplication {
  logger.log('Enabling Swagger');
  const config = new DocumentBuilder()
    .setTitle('SenseMaker APIs')
    .setDescription('The APIs for the SenseMaker backend')
    // TODO automatically retrieve the version
    .setVersion('1.0')
    // .setContact('', '', '')
    // .setLicense('', '')
    // .setTermsOfService('')
    // TODO automatically retrieve the server
    .addServer('http://localhost:3000')
    .addBearerAuth()
    // .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return app;
}
