import { randomUUID } from 'node:crypto';
import { InfoExtension } from './info-extension.interface.js';

export function mockInfoExtension({
  info = vi.fn(),
  name = randomUUID(),
}: Partial<InfoExtension>): InfoExtension {
  return { info, name };
}
