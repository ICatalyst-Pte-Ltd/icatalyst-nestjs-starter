import { TransformFnParams } from 'class-transformer';
import { toNumber } from './transform-number';

describe(toNumber.name, () => {
  it('should transform to a number', () => {
    const params = { value: '123' } as TransformFnParams;

    const result = toNumber(params);

    expect(result).toBe(123);
  });
});
