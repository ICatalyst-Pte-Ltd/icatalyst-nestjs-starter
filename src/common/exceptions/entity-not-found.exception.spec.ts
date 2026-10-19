import { randomUUID } from 'node:crypto';
import { EntityNotFoundException } from './entity-not-found.exception.js';

describe(EntityNotFoundException.name, () => {
  it('should', () => {
    const id = randomUUID();

    const result = new EntityNotFoundException('EntityName', id);

    expect(result.message).toBe(`EntityName (${id}) does not exists`);
  });
});
