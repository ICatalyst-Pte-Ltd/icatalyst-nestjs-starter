import { randomInt } from 'node:crypto';
import { CI } from './ci.entity.js';

export function mockCI({
  pipelineId = randomInt(10_000).toString(),
  pipelineInternalId = randomInt(1_000_000).toString(),
  pipelineUrl = 'https://example.com',
}: Partial<CI>): CI {
  return { pipelineId, pipelineInternalId, pipelineUrl };
}
