import { ForbiddenException } from '@nestjs/common';

export class EntityNoAccessException extends ForbiddenException {
  /**
   * @param entityName the name of the entity
   * @param entityID the ID of the entity
   */
  constructor(entityName: string, entityID: string) {
    super(`No access to ${entityName} (${entityID})`);
  }
}
