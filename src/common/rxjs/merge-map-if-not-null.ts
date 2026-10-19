import { Observable, OperatorFunction, mergeMap, of } from 'rxjs';

type MapFunction<T, R> = (value: T) => Observable<R>;
type MappedValueOrNull<T, R> = (value: T | null) => Observable<R | null>;

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
 *   mergeMapIfNotNull((value) => of(value * value)),
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
export function mergeMapIfNotNull<T, R>(
  mapFunction: MapFunction<T, R>,
): OperatorFunction<T | null, R | null> {
  return mergeMap(mappedValueOrNull(mapFunction));
}

export function mappedValueOrNull<T, R>(
  mapFunction: MapFunction<T, R>,
): MappedValueOrNull<T, R> {
  return (value) => {
    return value == null ? of(null) : mapFunction(value);
  };
}
