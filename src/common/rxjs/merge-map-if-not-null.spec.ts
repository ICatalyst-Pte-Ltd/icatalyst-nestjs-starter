import { firstValueFrom, of } from 'rxjs';
import {
  mappedValueOrNull,
  mergeMapIfNotNull,
} from './merge-map-if-not-null.js';

describe(mergeMapIfNotNull.name, () => {
  it('should return a function', () => {
    const result = mergeMapIfNotNull((value) => of(value));

    expect(typeof result).toBe('function');
  });
});

describe(mappedValueOrNull.name, () => {
  it('should return a function', () => {
    const result = mappedValueOrNull((value) => of(value));

    expect(typeof result).toBe('function');
  });

  describe('call', () => {
    it('should return the mapped value', async () => {
      const value = 'a';

      const observable = mappedValueOrNull<string, string>((value) =>
        of(value + value),
      )(value);

      await expect(firstValueFrom(observable)).resolves.toBe('aa');
    });

    it('should return a null if value is null', async () => {
      const observable = mappedValueOrNull((value) => of(value))(null);

      await expect(firstValueFrom(observable)).resolves.toBe(null);
    });
  });
});
