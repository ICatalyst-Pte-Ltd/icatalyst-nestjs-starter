export type ID = UUID | number;
export type URL = string;
export type UUID = string;

/**
 * Provides a convenient way to specify properties of a object to override
 * with a function.
 *
 * @template T The type of the object.
 * @template K The keys of the object.
 */
export type Overrides<T, K extends keyof T> = {
  [Key in keyof Pick<T, K>]?: (value: T[Key]) => T[Key];
};
