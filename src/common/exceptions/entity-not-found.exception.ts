import { NotFoundException } from '@nestjs/common';

/**
 * The EntityNotFoundException represents a {@link NotFoundException} with
 * a specific message format.
 *
 * Extend from this class instead of the NotFoundException for a consistent
 * message format.
 */
export class EntityNotFoundException extends NotFoundException {
  /**
   * Instantiates a new instance of this class.
   *
   * @param entityName the name of the entity.
   * @param entityID the ID of the entity.
   */
  constructor(entityName: string, entityID: string) {
    super(`${entityName} (${entityID}) does not exists`);
  }
}
