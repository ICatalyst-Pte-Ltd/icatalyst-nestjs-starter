import { Transform, TransformFnParams } from 'class-transformer';
import { clean } from '../sanitize/index.js';

export function cleanValue({ value }: TransformFnParams): unknown {
  return clean(value);
}

export function TransformClean(): PropertyDecorator {
  return Transform(cleanValue);
}
