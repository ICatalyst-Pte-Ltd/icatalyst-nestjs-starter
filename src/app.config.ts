import { randomBytes } from 'crypto';
import { env } from './common';

const APP_NAME = 'APP_NAME';

function defaultName(
  prefix = '',
  size = 9, // in base64 encoding, use multiple of 3 to avoid padding
  encoding: BufferEncoding = 'base64',
): string {
  return `${prefix}-${randomBytes(size).toString(encoding)}`;
}

export class AppConfig {
  constructor(public readonly name: string = env(APP_NAME, defaultName)) {}
}
