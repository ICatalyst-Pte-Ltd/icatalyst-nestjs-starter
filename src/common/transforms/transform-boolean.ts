import { Transform, TransformFnParams } from 'class-transformer';

export function toBoolean({ value }: TransformFnParams): boolean {
  // It will always convert into a string before calling toLowerCase()
  return ['true', 'yes'].includes(`${value}`.toLowerCase());
}

export function TransformBoolean(): PropertyDecorator {
  return Transform(toBoolean);
}
