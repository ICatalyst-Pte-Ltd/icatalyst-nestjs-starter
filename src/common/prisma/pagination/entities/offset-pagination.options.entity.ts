import { IsInt, IsNumber, Min } from 'class-validator';
import { TransformNumber } from '../../../transforms/index.js';
import { BasePaginationOptions } from './base-pagination.options.entity.js';

export class OffsetPaginationOptions extends BasePaginationOptions {
  /**
   * The number of records to skip before starting to collect the result set.
   *
   * This is useful for pagination, where you want to skip a certain number of records
   * (e.g., for the next page of records).
   *
   * @example 123
   */
  @IsNumber()
  @Min(0)
  @IsInt()
  @TransformNumber()
  readonly skip!: number;
}
