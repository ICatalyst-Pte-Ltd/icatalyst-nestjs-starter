import { IsString, IsUrl } from 'class-validator';

/**
 * Information about the CI that deployed an application
 */

export class CI {
  /**
   * The ID of a CI pipeline
   *
   * @example '1234567890'
   */
  @IsString()
  readonly pipelineId!: string;

  /**
   * The internal ID of a CI pipeline
   *
   * @example '123'
   */
  @IsString()
  readonly pipelineInternalId!: string;

  /**
   * The URL of a CI pipeline
   *
   * @example https://example.com/pipeline/1234567890
   */
  @IsUrl()
  readonly pipelineUrl!: string;
}
