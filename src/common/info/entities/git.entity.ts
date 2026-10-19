import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { Commit } from './commit.entity.js';

/**
 * Information about the Git repository
 */
export class Git {
  /**
   * The Git branch on which an application is deployed
   *
   * @example main
   */
  @IsString()
  readonly branch!: string;

  /**
   * The commit information on which an application is deployed
   */
  @ValidateNested()
  @Type(() => Commit)
  readonly commit!: Commit;
}
