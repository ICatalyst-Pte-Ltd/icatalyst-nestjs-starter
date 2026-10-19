import { registerDecorator, ValidationOptions } from 'class-validator';
import { ExactlyOneOfConstraint } from './exactly-one-of-constraint.js';

/**
 * Class-level decorator that requires exactly one of the given properties to be
 * set (non-null and non-undefined). Use on a synthetic property with
 * `@ValidateIf` on each optional branch so nested validation runs only for the
 * active mode.
 *
 * @param properties - Mutually exclusive property names (e.g. `signifierID`, `signifier`).
 * @param validationOptions - Optional `class-validator` options.
 *
 * @example
 * ```ts
 * class CreateFrameworkSignifierRequestDto {
 *   @ValidateIf((dto) => dto.signifierID == null)
 *   signifier?: CreateSignifierDto;
 *
 *   @ValidateIf((dto) => dto.signifier == null)
 *   signifierID?: string;
 *
 *   @ExactlyOneOf(['signifier', 'signifierID'])
 *   protected readonly _exactlyOneOf?: unknown;
 * }
 * ```
 */
export function ExactlyOneOf(
  properties: Array<string>,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [properties],
      validator: ExactlyOneOfConstraint,
    });
  };
}
