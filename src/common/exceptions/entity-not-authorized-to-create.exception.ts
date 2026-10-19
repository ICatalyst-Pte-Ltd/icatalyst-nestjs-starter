import { ForbiddenException } from '@nestjs/common';

export class EntityNotAuthorizedToCreateException extends ForbiddenException {
  /**
   * @param entityName the name of the entity
   */
  constructor(entityName: string) {
    super(`Not authorized to create ${entityName}`);
  }
}
