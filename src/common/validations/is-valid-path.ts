import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsValidPathConstraint } from './is-valid-path-constraint.js';

export function IsValidPath(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPathConstraint,
    });
  };
}
