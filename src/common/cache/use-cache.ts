import { Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BinaryToTextEncoding, createHash } from 'crypto';
import { Observable, of, tap } from 'rxjs';

interface CacheKeyOptions {
  /**
   * The algorithm to use for computing a hash.
   */
  algorithm: 'sha256' | 'sha512';
  /**
   * The encoding to use for converting a hash into a string.
   */
  encoding: BinaryToTextEncoding;
  /**
   * The string to use as a separator.
   */
  separator: string;
}

function cacheKey(
  target: object,
  propertyKey: string | symbol,
  args: Array<unknown>,
  {
    algorithm = 'sha256',
    encoding = 'base64',
    separator = ':',
  }: Partial<CacheKeyOptions> = {},
): string {
  const name = target.constructor.name;
  const key = propertyKey.toString();
  const params = JSON.stringify(args);
  const hash = createHash(algorithm).update(params).digest(encoding);
  return `${name}${separator}${key}${separator}${hash}`;
}

function isCache(cache: unknown): cache is Cache {
  return (
    cache != undefined &&
    typeof cache === 'object' &&
    'get' in cache &&
    typeof cache.get === 'function' &&
    'set' in cache &&
    typeof cache.set === 'function'
  );
}

interface CacheObject {
  isObservable: boolean;
  value: unknown;
}

const logger = new Logger(UseCache.name);

/**
 * A decorator factory to cache the return value of a method.
 *
 * **NOTE**: any method that is decorated with `@UseCache()` automatically becomes an
 * asynchronous method. If the method is not marked as `async`, please mark it as `async`
 * to help detect issues due to the return type changing to a promise.
 *
 * @param ttl the time-to-live (in milliseconds) of the cached item.
 * @returns a method decorator.
 */
export function UseCache(ttl?: number): MethodDecorator {
  return function cacheDecorator(
    target,
    propertyKey,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value as (...args: Array<unknown>) => unknown;
    descriptor.value = async function cacheResult(...args: Array<unknown>) {
      const cache = (this as { cache?: unknown }).cache;
      if (isCache(cache)) {
        logger.debug({
          function: cacheDecorator.name,
          message: 'Using cache',
          target: target.constructor.name,
          propertyKey,
        });
        const key = cacheKey(target, propertyKey, args);
        logger.debug({
          function: cacheResult.name,
          message: 'Looking up cache key',
          key,
        });
        let result: unknown = await cache.get<CacheObject>(key);
        if (result == undefined) {
          logger.debug({
            function: cacheResult.name,
            message: 'Cache miss',
          });
          result = method.apply(this, args);
          if (result instanceof Promise) {
            logger.debug({
              function: cacheResult.name,
              message: 'Result is a promise',
            });
            // not returning immediately because
            // the promise can resolve to an observable
            result = await result;
          }
          if (result instanceof Observable) {
            logger.debug({
              function: cacheResult.name,
              message: 'Result is an observable',
            });
            return result.pipe(
              tap((value) =>
                cache.set(key, { isObservable: true, value }, ttl),
              ),
            );
          }
          logger.debug({
            function: cacheResult.name,
            message: 'Result is neither a promise or an observable',
            type: typeof result,
          });
          await cache.set(key, { isObservable: false, value: result }, ttl);
          return result;
        }
        logger.debug({
          function: cacheResult.name,
          message: 'Cache hit',
          result,
        });
        const cacheObject = result as CacheObject;
        return cacheObject.isObservable
          ? of(cacheObject.value)
          : cacheObject.value;
      }
      logger.debug({
        function: cacheResult.name,
        message: 'Cache is not the right type',
        cache: typeof cache,
      });
      return method.apply(this, args);
    };
    return descriptor;
  };
}
