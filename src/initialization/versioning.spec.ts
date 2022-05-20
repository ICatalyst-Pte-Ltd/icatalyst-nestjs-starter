import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { enableVersioning } from './versioning';

describe(enableVersioning.name, () => {
  it('should initialize versioning', () => {
    const app = {} as INestApplication;
    app.enableVersioning = jest.fn();
    const logger = {} as Logger;
    logger.log = jest.fn();

    const result = enableVersioning(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toBeCalledWith('Enabling API versioning');
    expect(app.enableVersioning).toBeCalledWith({
      defaultVersion: '2',
      type: VersioningType.URI,
    });
  });
});
