import { OperatorFunction, map } from 'rxjs';

type MapFunction<T, R> = (value: T) => R;
type MappedValueOrNull<T, R> = (value: T | null) => R | null;

/**
 * A convenience function that will apply the given `mapFunction` to
 * an emitted value that is not `null`.
 *
 * ## Example
 *
 * Multiply the emitted by itself if it is not `null`.
 *
 * ```typescript
 * of([1, 2, null, 3])
 * .pipe(
 *   mapIfNotNull((value) => value * value),
 * )
 * .subscribe({
 *   next(value) {
 *    console.log('Value is ', value);
 *   },
 * });
 * ```
 *
 * @param mapFunction the function to apply to an emitted value
 * that is not `null`.
 * @returns an observable that will apply the `mapFunction`
 * if the emitted value is not `null`.
 */
export function mapIfNotNull<T, R>(
  mapFunction: MapFunction<T, R>,
): OperatorFunction<T | null, R | null> {
  return map(mappedValueOrNull(mapFunction));
}

export function mappedValueOrNull<T, R>(
  mapFunction: MapFunction<T, R>,
): MappedValueOrNull<T | null, R | null> {
  return (value) => {
    return value == null ? null : mapFunction(value);
  };
}
