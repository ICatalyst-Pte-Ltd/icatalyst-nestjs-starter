import { randomUUID } from 'node:crypto';
import { EntityNoAccessException } from './entity-no-access.exception.js';

describe(EntityNoAccessException.name, () => {
  it('should', () => {
    const id = randomUUID();

    const result = new EntityNoAccessException('EntityName', id);

    expect(result.message).toBe(`No access to EntityName (${id})`);
  });
});
