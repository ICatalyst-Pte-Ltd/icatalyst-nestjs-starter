import { Logger, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, ValidateNested } from 'class-validator';
import { TransformToInstance } from '../../../transforms/index.js';

export interface FindManyResult<T> {
  readonly data: ReadonlyArray<T>;
  readonly metadata: Record<string, unknown>;
}

const logger = new Logger(createFindManyResult.name);

export function createFindManyResult<T>(
  ItemType: Type<T>,
): Type<FindManyResult<T>> {
  class FindManyResultEntity implements FindManyResult<T> {
    /**
     * A list of {@link ItemType}.
     */
    @ApiProperty({
      description: `A list of ${ItemType.name}.`,
      isArray: true,
      type: ItemType,
    })
    @IsArray()
    @TransformToInstance(ItemType)
    @ValidateNested({ each: true })
    readonly data!: ReadonlyArray<T>;

    /**
     * The metadata related to {@link ItemType}.
     */
    @ApiProperty({
      description: `The metadata related to ${ItemType.name}.`,
    })
    @IsObject()
    readonly metadata!: Record<string, unknown>;
  }
  const name = `FindMany${ItemType.name}Result`;
  Object.defineProperty(FindManyResultEntity, 'name', {
    value: name,
  });
  logger.debug({
    class: FindManyResultEntity,
    function: createFindManyResult.name,
    name,
  });
  return FindManyResultEntity;
}
