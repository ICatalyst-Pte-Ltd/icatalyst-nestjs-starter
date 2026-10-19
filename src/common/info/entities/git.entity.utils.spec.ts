import { randomUUID } from 'node:crypto';
import { mockCommit } from './commit.entity.utils.spec.js';
import { Git } from './git.entity.js';

export function mockGit({
  branch = randomUUID(),
  commit = mockCommit({}),
}: Partial<Git>): Git {
  return { branch, commit };
}
