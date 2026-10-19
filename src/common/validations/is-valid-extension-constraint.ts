import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidExtensionConstraint implements ValidatorConstraintInterface {
  validate(extension: string, args: ValidationArguments): boolean {
    const allowedExtensions = args.constraints;

    return allowedExtensions.includes(extension);
  }

  defaultMessage(): string {
    return 'Extension is not valid';
  }
}
