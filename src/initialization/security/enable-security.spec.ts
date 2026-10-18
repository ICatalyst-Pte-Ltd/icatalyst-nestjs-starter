import { INestApplication, Logger } from '@nestjs/common';
import { enableSecurity } from './index.js';

describe(enableSecurity.name, () => {
  it('should call the associated functions', () => {
    const app = {
      enableCors: vi.fn(),
      use: vi.fn(),
    } as unknown as INestApplication;
    const logger = {
      log: vi.fn(),
    } as unknown as Logger;

    const result = enableSecurity(app, logger);

    expect(result).toBe(app);
    expect(app.use).toBeCalledTimes(1);
    expect(app.enableCors).toBeCalledTimes(1);
  });
});
