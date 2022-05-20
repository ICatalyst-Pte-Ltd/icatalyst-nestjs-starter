import { Transform, TransformFnParams } from 'class-transformer';

export function toBoolean({ value }: TransformFnParams): boolean {
  return ['true', 'yes'].includes(value.toLowerCase());
}

export function TransformBoolean() {
  return Transform(toBoolean);
}
