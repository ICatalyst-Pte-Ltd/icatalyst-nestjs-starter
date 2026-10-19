import { IsDate, IsUUID, ValidateIf } from 'class-validator';
import { TransformDate } from '../../../transforms/index.js';
import { BasePaginationOptions } from './base-pagination.options.entity.js';

export class CursorPaginationOptions extends BasePaginationOptions {
  /**
   * The created date of the last record that was seen.
   *
   * This is useful for pagination, where you want to resume from that last record.
   * (e.g., for the next page of records).
   */
  @IsDate()
  @TransformDate()
  @ValidateIf((o) => o.id != undefined)
  readonly createdAt?: Date;

  /**
   * The ID of the last record that was seen.
   *
   * This is useful for pagination, where you want to resume from that last record.
   * (e.g., for the next page of records).
   */
  @IsUUID()
  @ValidateIf((o) => o.createdAt != undefined)
  readonly id?: string;
}
