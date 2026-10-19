import { Type } from 'class-transformer';
import { IsObject, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Build } from './build.entity.js';
import { CI } from './ci.entity.js';
import { Git } from './git.entity.js';

/**
 * Information about the application
 */
export class Info {
  /**
   * The build information
   */
  @ValidateNested()
  @Type(() => Build)
  readonly build!: Build;

  /**
   * The CI information
   */
  @ValidateNested()
  @Type(() => CI)
  readonly ci!: CI;

  /**
   * Additional information from extensions.
   */
  @IsObject()
  readonly extensions!: Record<string, unknown>;

  /**
   * The Git information
   */
  @ValidateNested()
  @Type(() => Git)
  readonly git!: Git;

  /**
   * The name of the application
   *
   * @example 'application name'
   */
  @IsString()
  readonly name!: string;

  /**
   * The URL of the application
   *
   * @example https://example.com
   */
  @IsUrl()
  readonly url!: string;
}
