import { OperatorFunction, map } from 'rxjs';

type ErrorFactory = () => Error;
type ValueOrThrow<T> = (value: T) => NonNullable<T>;

/**
 * If the emitted value is `null`, it will emit an error.
 * The error will be created at that time by the `factory` argument.
 *
 * ## Example
 *
 * Throw an error if a `null` value is emitted.
 *
 * ```typescript
 * of(null)
 * .pipe(
 *   throwIfNull(() => new Error('Value is null')),
 * )
 * .subscribe({
 *   next(value) {
 *    console.log('Value is ', value);
 *   },
 *   error(err) {
 *     console.error(err.message);
 *   },
 * });
 * ```
 *
 * @param factory a factory function to produce the error to be thrown
 * when the source observable emits a `null` value.
 * @return a function that returns an observable that throws an error if
 * a `null` value is emitted.
 */
export function throwIfNull<T>(
  factory: ErrorFactory,
): OperatorFunction<T, NonNullable<T>> {
  return map(valueOrThrow(factory));
}

export function valueOrThrow<T>(factory: ErrorFactory): ValueOrThrow<T> {
  return (value) => {
    if (value == null) {
      throw factory();
    }
    return value;
  };
}
