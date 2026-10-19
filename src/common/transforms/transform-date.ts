import { Transform, TransformFnParams } from 'class-transformer';

export function toDate({ value }: TransformFnParams): Date | undefined {
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

export function TransformDate(): PropertyDecorator {
  return Transform(toDate);
}
