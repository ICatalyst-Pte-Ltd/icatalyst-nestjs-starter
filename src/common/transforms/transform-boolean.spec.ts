import { TransformFnParams } from 'class-transformer';
import { toBoolean } from './transform-boolean';

describe(toBoolean.name, () => {
  it.each([
    { value: '', expected: false },
    { value: 'true', expected: true },
    { value: 'TRUE', expected: true },
    { value: 'yes', expected: true },
    { value: 'YES', expected: true },
    { value: 'false', expected: false },
    { value: 'FALSE', expected: false },
    { value: 'no', expected: false },
    { value: 'NO', expected: false },
  ])('$#: should transform `$value` to $expected', ({ value, expected }) => {
    const result = toBoolean({ value } as TransformFnParams);

    expect(result).toBe(expected);
  });
});
