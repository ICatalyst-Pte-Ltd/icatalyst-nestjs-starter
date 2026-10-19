import { randomUUID } from 'node:crypto';
import { mockBuild } from './build.entity.utils.spec.js';
import { mockCI } from './ci.entity.utils.spec.js';
import { mockGit } from './git.entity.utils.spec.js';
import { Info } from './info.entity.js';

export function mockInfo({
  build = mockBuild({}),
  ci = mockCI({}),
  extensions = {},
  git = mockGit({}),
  name = randomUUID(),
  url = 'https://example.com',
}: Partial<Info>): Info {
  return { build, ci, extensions, git, name, url };
}
