import { Logger } from '@nestjs/common';
import { DEFAULT_BASE_DELAY, DEFAULT_MAX_DELAY } from './constants.js';

export function reconnectStrategy(
  logger: Logger,
  baseDelay?: number,
  maxDelay?: number,
) {
  return (retries: number): number => {
    const base = baseDelay ?? DEFAULT_BASE_DELAY;
    const max = maxDelay ?? DEFAULT_MAX_DELAY;
    const computed = base * 2 ** retries;
    const delay = Math.min(computed, max);
    logger.log({
      computedDelayInMilliseconds: computed,
      delayInMilliseconds: delay,
      message: 'Reconnecting to Redis',
      retries,
    });
    return delay;
  };
}
