import { randomUUID } from 'node:crypto';
import { EntityNotFoundException } from './exceptions';

describe(EntityNotFoundException.name, () => {
  it('should', () => {
    const id = randomUUID();

    const result = new EntityNotFoundException('EntityName', id);

    expect(result.message).toBe(`EntityName (${id}) does not exists`);
  });
});
