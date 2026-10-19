import { EntityNotAuthorizedToCreateException } from './entity-not-authorized-to-create.exception.js';

describe(EntityNotAuthorizedToCreateException.name, () => {
  it('should', () => {
    const result = new EntityNotAuthorizedToCreateException('EntityName');

    expect(result.message).toBe(`Not authorized to create EntityName`);
  });
});
