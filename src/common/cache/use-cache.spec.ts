import type { Mock } from 'vitest';
import { Logger } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { lastValueFrom, of } from 'rxjs';
import { UseCache } from './use-cache.js';

describe(UseCache.name, () => {
  beforeEach(() => {
    Logger.prototype.debug = vi.fn();
  });

  it('should return a function', () => {
    const result = UseCache();

    expect(typeof result).toBe('function');
    expect(result.name).toBe('cacheDecorator');
  });

  describe('cacheDecorator', () => {
    it('should replace the original function', () => {
      const target = {};
      const propertyKey = 'propertyKey';
      const descriptor = {};
      const decorator = UseCache();

      const result = decorator(
        target,
        propertyKey,
        descriptor,
      ) as PropertyDescriptor;

      expect(typeof result.value).toBe('function');
      expect(result.value.name).toBe('cacheResult');
    });

    describe('cacheResult', () => {
      let cache: {
        get: Mock<(...args: Array<unknown>) => Promise<unknown>>;
        set: Mock<(...args: Array<unknown>) => Promise<void>>;
      };

      beforeEach(() => {
        cache = {
          get: vi.fn(),
          set: vi.fn(),
        };
      });

      it('should await a promise result', async () => {
        cache.get.mockResolvedValue(undefined);
        const value = randomUUID();
        class TestClass {
          cache = cache;

          @UseCache()
          async testMethod() {
            return value;
          }
        }
        const test = new TestClass();

        const result = await test.testMethod();

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
          { isObservable: false, value },
          undefined,
        );
      });

      it('should tap an observable result', async () => {
        cache.get.mockResolvedValue(undefined);
        const value = randomUUID();
        class TestClass {
          cache = cache;

          @UseCache()
          async testMethod() {
            return of(value);
          }
        }
        const test = new TestClass();

        const result = await lastValueFrom(await test.testMethod());

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
          { isObservable: true, value },
          undefined,
        );
      });

      it('should cache the value', async () => {
        cache.get.mockResolvedValue(undefined);
        const value = randomUUID();
        class TestClass {
          cache = cache;

          @UseCache()
          async testMethod() {
            return value;
          }
        }
        const test = new TestClass();

        const result = await test.testMethod();

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
          { isObservable: false, value },
          undefined,
        );
      });

      it('should cache the value with ttl', async () => {
        cache.get.mockResolvedValue(undefined);
        const ttl = randomInt(10_000);
        const value = randomUUID();
        class TestClass {
          cache = cache;

          @UseCache(ttl)
          async testMethod() {
            return value;
          }
        }
        const test = new TestClass();

        const result = await test.testMethod();

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
          { isObservable: false, value },
          ttl,
        );
      });

      it('should return the cached value', async () => {
        const value = randomUUID();
        cache.get.mockResolvedValue({ isObservable: false, value });
        class TestClass {
          cache = cache;

          @UseCache()
          async testMethod() {
            return randomUUID();
          }
        }
        const test = new TestClass();

        const result = await test.testMethod();

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).not.toHaveBeenCalled();
      });

      it('should return the cached value that was from an observable', async () => {
        const value = randomUUID();
        cache.get.mockResolvedValue({ isObservable: true, value });
        class TestClass {
          cache = cache;

          @UseCache()
          async testMethod() {
            return of(randomUUID());
          }
        }
        const test = new TestClass();

        const result = await lastValueFrom(await test.testMethod());

        expect(result).toBe(value);
        expect(cache.get).toHaveBeenCalledWith(
          'TestClass:testMethod:T1PNoYwrqgwDVLtfmj7L5e0Sq02OEbqHPC8RFhICuUU=',
        );
        expect(cache.set).not.toHaveBeenCalled();
      });

      it('should return the original value if cache property is not a cache', async () => {
        const value = randomUUID();
        class TestClass {
          cache = { get: vi.fn() };

          @UseCache()
          async testMethod() {
            return value;
          }
        }
        const test = new TestClass();

        const result = await test.testMethod();

        expect(result).toBe(value);
        expect(cache.get).not.toHaveBeenCalled();
      });
    });
  });
});
