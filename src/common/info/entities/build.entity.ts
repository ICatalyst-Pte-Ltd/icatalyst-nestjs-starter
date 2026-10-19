import { IsSemVer } from 'class-validator';

/**
 * Information about the build of an application
 */

export class Build {
  /**
   * The version of an application
   *
   * @example '1.2.3'
   */
  @IsSemVer()
  readonly version!: string;
}
