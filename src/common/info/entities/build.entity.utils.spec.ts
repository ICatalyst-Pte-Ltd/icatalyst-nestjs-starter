import { randomInt } from 'node:crypto';
import { Build } from './build.entity.js';

export function mockBuild({
  version = `${randomInt(255)}.${randomInt(255)}.${randomInt(255)}`,
}: Partial<Build>): Build {
  return { version };
}
