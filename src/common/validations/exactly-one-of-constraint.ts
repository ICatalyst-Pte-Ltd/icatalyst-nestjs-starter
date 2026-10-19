import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'exactlyOneOf', async: false })
export class ExactlyOneOfConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const properties = args.constraints[0] as Array<string>;
    const object = args.object as Record<string, unknown>;
    const definedCount = properties.filter(
      (property) => object[property] !== undefined && object[property] !== null,
    ).length;

    return definedCount === 1;
  }

  defaultMessage(args: ValidationArguments): string {
    const properties = args.constraints[0] as Array<string>;
    return `Exactly one of [${properties.join(', ')}] must be provided`;
  }
}
