import { mapIfNotNull, mappedValueOrNull } from './map-if-not-null.js';

describe(mapIfNotNull.name, () => {
  it('should return a function', () => {
    const result = mapIfNotNull((value) => value);

    expect(typeof result).toBe('function');
  });
});

describe(mappedValueOrNull.name, () => {
  it('should return a function', () => {
    const result = mappedValueOrNull((value) => value);

    expect(typeof result).toBe('function');
  });

  describe('call', () => {
    it('should return the mapped value', () => {
      const value = 'a';

      const result = mappedValueOrNull<string, string>(
        (value) => value + value,
      )(value);

      expect(result).toBe('aa');
    });

    it('should return a null if value is null', () => {
      const result = mappedValueOrNull((value) => value)(null);

      expect(result).toBe(null);
    });
  });
});
