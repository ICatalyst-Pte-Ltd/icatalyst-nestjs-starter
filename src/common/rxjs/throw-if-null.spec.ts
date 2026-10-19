import { randomUUID } from 'crypto';
import { throwIfNull, valueOrThrow } from './throw-if-null.js';

describe(throwIfNull.name, () => {
  it('should return a function', () => {
    const result = throwIfNull(() => new Error('this is an error'));

    expect(typeof result).toBe('function');
  });
});

describe(valueOrThrow.name, () => {
  it('should return a function', () => {
    const factory = () => new Error();

    const result = valueOrThrow(factory);

    expect(typeof result).toBe('function');
  });

  describe('call', () => {
    it('should return the value', () => {
      const value = { id: randomUUID() };
      const factory = () => new Error();

      const result = valueOrThrow(factory)(value);

      expect(result).toBe(value);
    });

    it('should throw an error if value is null', () => {
      const error = new Error(randomUUID());

      function toThrow() {
        valueOrThrow(() => error)(null);
      }

      expect(toThrow).toThrow(error);
    });
  });
});
