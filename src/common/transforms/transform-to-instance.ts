import { plainToInstance, Transform } from 'class-transformer';
import { isJSON } from 'class-validator';

interface TransformToInstanceOptions {
  /**
   * Whether the data is supposed to be an array or not.
   */
  array?: boolean;
}

export function toInstance<T>(
  Class: new () => T,
  value: unknown,
  { array = false }: TransformToInstanceOptions,
): T | Array<T> | unknown {
  if (typeof value === 'string' && isJSON(value)) {
    try {
      const json = JSON.parse(value);
      if (array && Array.isArray(json)) {
        return json.map((item) => toInstance(Class, item, {}));
      }
      if (!array && !Array.isArray(json)) {
        return plainToInstance(Class, json);
      }
    } catch {
      // fall through to return value
    }
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return plainToInstance(Class, value);
  }
  return value;
}

export function TransformToInstance<T>(
  Class: new () => T,
  options: TransformToInstanceOptions = {},
): PropertyDecorator {
  return Transform(({ value }) => toInstance(Class, value, options));
}
