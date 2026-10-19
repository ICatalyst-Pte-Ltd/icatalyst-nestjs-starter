import { plainToInstance, TransformFnParams } from 'class-transformer';
import { toBoolean, TransformBoolean } from './transform-boolean.js';

describe(TransformBoolean.name, () => {
  class TestDto {
    @TransformBoolean()
    readonly flag!: boolean;
  }

  it.each([
    { value: 'yes', expected: true },
    { value: 'no', expected: false },
  ])(
    '$#: should transform the property `$value` to $expected',
    ({ value, expected }) => {
      const result = plainToInstance(TestDto, { flag: value });

      expect(result.flag).toBe(expected);
    },
  );
});

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
