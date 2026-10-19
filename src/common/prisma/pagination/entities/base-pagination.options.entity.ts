import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { TransformNumber } from '../../../transforms/index.js';

export class BasePaginationOptions {
  /**
   * The maximum number of records to return.
   *
   * This is useful for limiting the number of records returned in a single query,
   * which is often necessary for performance reasons or to implement pagination.
   *
   * @example 123
   */
  @IsNumber()
  @IsPositive()
  @IsInt()
  @TransformNumber()
  readonly take!: number;
}
