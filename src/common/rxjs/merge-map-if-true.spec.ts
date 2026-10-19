import { randomUUID } from 'node:crypto';
import { firstValueFrom, of, toArray } from 'rxjs';
import { factoryOrEmpty, mergeMapIfTrueOrEmpty } from './merge-map-if-true.js';

describe(mergeMapIfTrueOrEmpty.name, () => {
  it('should return a function', () => {
    const result = mergeMapIfTrueOrEmpty(() => of(randomUUID()));

    expect(typeof result).toBe('function');
  });
});

describe(factoryOrEmpty.name, () => {
  it('should return a function', () => {
    const result = factoryOrEmpty(() => of(randomUUID()));

    expect(typeof result).toBe('function');
  });

  describe('call', () => {
    it('should return the observable from the factory if true', async () => {
      const value = randomUUID();
      const observable = factoryOrEmpty(() => of(value))(true);

      await expect(firstValueFrom(observable)).resolves.toBe(value);
    });

    it('should return empty if false', async () => {
      const value = randomUUID();
      const observable = factoryOrEmpty(() => of(value))(false);

      await expect(firstValueFrom(observable.pipe(toArray()))).resolves.toEqual(
        [],
      );
    });
  });
});
