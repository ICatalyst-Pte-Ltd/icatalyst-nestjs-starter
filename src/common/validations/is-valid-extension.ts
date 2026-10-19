import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidExtensionConstraint } from './is-valid-extension-constraint.js';

export function IsValidExtension(
  validMimeTypes: Array<string>,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validMimeTypes,
      validator: IsValidExtensionConstraint,
    });
  };
}
