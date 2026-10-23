import { INestApplication, Logger } from '@nestjs/common';
import { enableSecurity } from './index.js';

describe(enableSecurity.name, () => {
  it('should call the associated functions', () => {
    const enableCors = vi.fn();
    const use = vi.fn();
    const app = { enableCors, use } as unknown as INestApplication;
    const logger = {
      log: vi.fn(),
    } as unknown as Logger;

    const result = enableSecurity(app, logger);

    expect(result).toBe(app);
    expect(use).toBeCalledTimes(1);
    expect(enableCors).toBeCalledTimes(1);
  });
});
