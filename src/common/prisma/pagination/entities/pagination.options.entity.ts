import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformToInstance } from '../../../transforms/index.js';
import { CursorPaginationOptions } from './cursor-pagination.options.entity.js';
import { OffsetPaginationOptions } from './offset-pagination.options.entity.js';

export class PaginationOptions {
  /**
   * The options for a cursor-based pagination.
   */
  @IsOptional()
  @ValidateNested()
  @TransformToInstance(CursorPaginationOptions)
  @Type(() => CursorPaginationOptions)
  readonly cursor?: CursorPaginationOptions;

  /**
   * The options for an offset-based pagination.
   */
  @IsOptional()
  @ValidateNested()
  @TransformToInstance(OffsetPaginationOptions)
  @Type(() => OffsetPaginationOptions)
  readonly offset?: OffsetPaginationOptions;
}
