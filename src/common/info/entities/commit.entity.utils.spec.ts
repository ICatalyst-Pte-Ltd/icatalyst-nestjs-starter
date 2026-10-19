import { createHash, randomUUID } from 'node:crypto';
import { Commit } from './commit.entity.js';

export function mockCommit({
  sha = createHash('sha256').update(randomUUID()).digest('hex'),
  time = new Date().toISOString(),
}: Partial<Commit>): Commit {
  return { sha, time };
}
