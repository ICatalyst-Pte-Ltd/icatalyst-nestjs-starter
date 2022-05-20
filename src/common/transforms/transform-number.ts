import { Transform, TransformFnParams } from 'class-transformer';

export function toNumber({ value }: TransformFnParams): number {
  return +value;
}

export function TransformNumber(): PropertyDecorator {
  return Transform(toNumber);
}
