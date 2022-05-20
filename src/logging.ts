import { LogLevel } from '@nestjs/common';

export function getLogLevels(): LogLevel[] {
  let result: LogLevel[];
  const level = process.env.APP_LOG_LEVEL as LogLevel;
  if (level) {
    result = [level];
  } else if (process.env.NODE_ENV === 'production') {
    result = ['log'];
  } else {
    result = ['debug'];
  }
  return result;
}
