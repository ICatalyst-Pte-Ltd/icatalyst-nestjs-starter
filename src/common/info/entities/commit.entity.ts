import { IsString } from 'class-validator';

/**
 * Information about a commit
 */
export class Commit {
  /**
   * The SHA of a commit
   *
   * @example 1234567890abcdef123456789abcdef123456789
   */
  @IsString()
  readonly sha!: string;

  /**
   * The time a commit was created
   *
   * @example 2000-01-23T00:00:00+00:00
   */
  @IsString()
  readonly time!: string;
}
