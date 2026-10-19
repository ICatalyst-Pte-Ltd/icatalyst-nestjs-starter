import { EMPTY, Observable, OperatorFunction, mergeMap } from 'rxjs';

type ObservableFactory<T> = () => Observable<T>;
type FactoryOrEmpty<T> = (value: boolean) => Observable<T | never>;

/**
 * A convenience function that emits an observable produced by the
 * `factory` function if the value emitted by the source observable
 * is `true`, or empty is emitted.
 *
 * ```typescript
 * of([true, false])
 * .pipe(
 *   mergeMapIfTrueOrEmpty(() => of('true')),
 * )
 * .subscribe({
 *   next(value) {
 *     console.log('Value is ', value)
 *   },
 * });
 * ```
 *
 * @param factory a factory function to produce an observable.
 * @returns a function that returns an observable that returns an
 * observable produced by the `factory` function if the emitted
 * value is `true`. Otherwise, the empty is returned.
 */
export function mergeMapIfTrueOrEmpty<T>(
  factory: ObservableFactory<T>,
): OperatorFunction<boolean, T> {
  return mergeMap(factoryOrEmpty(factory));
}

export function factoryOrEmpty<T>(
  factory: ObservableFactory<T>,
): FactoryOrEmpty<T> {
  return (value) => {
    return value ? factory() : EMPTY;
  };
}
