import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidTypeConstraint implements ValidatorConstraintInterface {
  validate(type: string, args: ValidationArguments): boolean {
    const allowedTypes = args.constraints;

    return allowedTypes.includes(type);
  }

  defaultMessage(): string {
    return 'Type is not valid.';
  }
}
