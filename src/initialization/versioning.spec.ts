import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { enableVersioning } from './versioning.js';

describe(enableVersioning.name, () => {
  it('should initialize versioning', () => {
    const app = {} as INestApplication;
    app.enableVersioning = vi.fn();
    const logger = {} as Logger;
    logger.log = vi.fn();

    const result = enableVersioning(app, logger);

    expect(result).toBe(app);
    expect(logger.log).toBeCalledWith('Enabling API versioning');
    expect(app.enableVersioning).toBeCalledWith({
      defaultVersion: '2',
      type: VersioningType.URI,
    });
  });
});
