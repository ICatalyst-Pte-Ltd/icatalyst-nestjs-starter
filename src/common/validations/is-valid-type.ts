import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidTypeConstraint } from './is-valid-type-constraint.js';

export function IsValidType(
  validTypes: Array<string>,
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: validTypes,
      validator: IsValidTypeConstraint,
    });
  };
}
