import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { enableVersioning } from './versioning.js';

describe(enableVersioning.name, () => {
  it('should initialize versioning', () => {
    const enableVersioningMock = vi.fn();
    const app = {
      enableVersioning: enableVersioningMock,
    } as unknown as INestApplication;
    const log = vi.fn();
    const logger = { log } as unknown as Logger;

    const result = enableVersioning(app, logger);

    expect(result).toBe(app);
    expect(log).toBeCalledWith('Enabling API versioning');
    expect(enableVersioningMock).toBeCalledWith({
      defaultVersion: '2',
      type: VersioningType.URI,
    });
  });
});
