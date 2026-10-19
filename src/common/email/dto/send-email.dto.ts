import { IsString } from 'class-validator';

/**
 * The mail parmeters used to send the email
 */
export class SendEmailDto {
  /**
   * The email to whom it has to be sent
   */
  @IsString()
  readonly to!: string;

  /**
   * The subject of the email
   */
  @IsString()
  readonly subject!: string;

  /**
   * The content of the email
   */
  @IsString()
  readonly text!: string;

  /**
   * The HTML content of the email
   */
  @IsString()
  readonly html!: string;
}
