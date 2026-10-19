import { IsDate, IsString, IsUUID, Length } from 'class-validator';
import { TransformClean } from '../transforms/index.js';

export class BaseEntity {
  /**
   * The ID of the entity.
   *
   * @example '00000000-0000-0000-0000-000000000000'
   */
  @IsUUID()
  readonly id!: string;

  /**
   * The timestamp when the entity was created.
   */
  @IsDate()
  readonly createdAt!: Date;

  /**
   * The user that created the entity.
   *
   * @example '<user-id>'
   */
  @IsString()
  @Length(1, 255)
  @TransformClean()
  readonly createdBy!: string;

  /**
   * The timestamp when the entity was last updated.
   */
  @IsDate()
  readonly updatedAt!: Date;

  /**
   * The user that last updated the entity.
   *
   * @example '<user-id>'
   */
  @IsString()
  @Length(1, 255)
  @TransformClean()
  readonly updatedBy!: string;
}
