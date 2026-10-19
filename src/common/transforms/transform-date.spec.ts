import { TransformFnParams } from 'class-transformer';
import { toDate } from './transform-date.js';

describe(toDate.name, () => {
  it.each([
    { expected: undefined, value: '' },
    { expected: undefined, value: 'x' },
    { expected: new Date('1970-01-01T00:00:00.001Z'), value: 1 },
    { expected: new Date('2000-12-31T00:00:00.000Z'), value: '2000-12-31' },
    { expected: undefined, value: '16:00:00' },
  ])('$#: should transform `$value` to $expected', ({ value, expected }) => {
    const result = toDate({ value } as TransformFnParams);

    expect(result).toEqual(expected);
  });
});
