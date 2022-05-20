import { Observer } from 'rxjs';

// common stuff for tests
export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export function observer<T>({
  next = () => {
    expect(true).toBe(false);
  },
  error = () => {
    expect(true).toBe(false);
  },
  complete = () => {
    expect(true).toBe(false);
  },
}: Partial<Observer<T>>): Observer<T> {
  return { next, error, complete };
}

it('nothing', () => {
  // nothing to test, simply reusable stuff that can be reused across
  // test suites
});
