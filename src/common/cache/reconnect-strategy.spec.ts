import type { Mock } from 'vitest';
import { Logger } from '@nestjs/common';
import { reconnectStrategy } from './reconnect-strategy.js';

describe(reconnectStrategy.name, () => {
  let strategy: (retries: number) => number;
  let log: Mock;

  beforeEach(() => {
    log = vi.fn();
    strategy = reconnectStrategy({ log } as unknown as Logger);
  });

  it.each([
    { computed: 1000, delay: 1000, retries: 0 },
    { computed: 2000, delay: 2000, retries: 1 },
    { computed: 4000, delay: 4000, retries: 2 },
    { computed: 8000, delay: 8000, retries: 3 },
    { computed: 1024000, delay: 10000, retries: 10 },
  ])(
    'should return a delay of $delay if retries is $retries',
    ({ retries, delay, computed }) => {
      const result = strategy(retries);

      expect(result).toBe(delay);
      expect(log).toHaveBeenCalledWith({
        computedDelayInMilliseconds: computed,
        delayInMilliseconds: delay,
        message: 'Reconnecting to Redis',
        retries,
      });
    },
  );
});

describe('with custom delay values', () => {
  let strategy: (retries: number) => number;
  let log: Mock;

  beforeEach(() => {
    log = vi.fn();
    strategy = reconnectStrategy({ log } as unknown as Logger, 500, 5000);
  });

  it.each([
    { computed: 500, delay: 500, retries: 0 },
    { computed: 1000, delay: 1000, retries: 1 },
    { computed: 2000, delay: 2000, retries: 2 },
    { computed: 4000, delay: 4000, retries: 3 },
    { computed: 512000, delay: 5000, retries: 10 },
  ])(
    'should return a delay of $delay if retries is $retries',
    ({ retries, delay, computed }) => {
      const result = strategy(retries);

      expect(result).toBe(delay);
      expect(log).toHaveBeenCalledWith({
        computedDelayInMilliseconds: computed,
        delayInMilliseconds: delay,
        message: 'Reconnecting to Redis',
        retries,
      });
    },
  );
});
