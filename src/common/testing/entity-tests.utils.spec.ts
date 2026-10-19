import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function isArray(property: string): string {
  return `${property} must be an array`;
}

export function isDate(property: string): string {
  return `${property} must be a Date instance`;
}

export function isEnum(o: object): (property: string) => string {
  return (property) => {
    return `${property} must be one of the following values: ${Object.keys(o).join(', ')}`;
  };
}

export function isInt(property: string): string {
  return `${property} must be an integer number`;
}

export function isNumber(property: string): string {
  return `${property} must be a number conforming to the specified constraints`;
}

export function isObject(property: string): string {
  return `${property} must be an object`;
}

export function isPositive(property: string): string {
  return `${property} must be a positive number`;
}

export function isSemVer(property: string): string {
  return `${property} must be a Semantic Versioning Specification`;
}

export function isString(property: string): string {
  return `${property} must be a string`;
}

export function isUrl(property: string): string {
  return `${property} must be a URL address`;
}

export function isUuid(property: string): string {
  return `${property} must be a UUID`;
}

export function matches(regex: RegExp): (property: string) => string {
  return (property) => {
    return `${property} must match ${regex} regular expression`;
  };
}

export function min(value: number): (property: string) => string {
  return (property) => {
    return `${property} must not be less than ${value}`;
  };
}

export function nestedValidation(property: string): string {
  return `nested property ${property} must be either object or array`;
}

export function nestedValidationEach(property: string): string {
  return `each value in ${nestedValidation(property)}`;
}

interface EntityTestCase<T, E, V = unknown> {
  /**
   * An object that contains the expected results.
   */
  expected: E;
  /**
   * The name of the property to test.
   */
  property: keyof T;
  /**
   * The value to be assigned to the property.
   */
  value: V;
}

interface EntityTestCase2<E, V = unknown> {
  /**
   * A description of the test.
   */
  description: string;
  /**
   * An object that contains the expected results.
   */
  expected: E;
  /**
   * The value to be assigned to the property.
   */
  value: V;
}

type Expected<T> = Record<string, string | ((property: keyof T) => string)>;

interface EntityValidationTestCase<T> {
  /**
   * Test cases for the property.
   */
  cases: ReadonlyArray<EntityTestCase2<Expected<T>>>;
  /**
   * The name of the property to test.
   */
  property: keyof T;
}

interface EntityTestCases<T> {
  /**
   * Test cases for nested validation of properties.
   */
  nested?: ReadonlyArray<
    EntityTestCase<
      T,
      | { children: ReadonlyArray<{ constraints: Expected<T> }> }
      | {
          children: ReadonlyArray<{
            children: ReadonlyArray<{ constraints: Expected<T> }>;
          }>;
        }
    >
  >;
  /**
   * Test cases for transformation of properties.
   */
  transform?: ReadonlyArray<EntityTestCase<T, number | object | string>>;
  /**
   * Test cases for validation of properties.
   */
  validation: ReadonlyArray<EntityValidationTestCase<T>>;
}

/**
 * A standardized testing for entity classes.
 *
 * @param Entity the entity class to test.
 * @param factory a factory to generate valid instances of the entity.
 * @param cases the test cases.
 */
export function entityTests<T extends object>(
  Entity: new (...args: Array<unknown>) => T,
  factory: (data: Partial<T>) => T,
  cases: EntityTestCases<T>,
): void {
  describe(Entity.name, () => {
    let data: T;

    beforeEach(() => {
      data = factory({});
    });

    it('should instantiate', async () => {
      const instance = plainToInstance(Entity, data);
      const errors = await validate(instance);

      expect(instance).toEqual(data);
      expect(errors).toEqual([]);
    });

    if (cases.nested != undefined && cases.nested.length > 0) {
      describe('nested', () => {
        if (cases.nested != undefined && cases.nested.length > 0) {
          it.each(cases.nested)(
            '$#: should do nested validation on "$property"',
            async ({ property, value, expected }) => {
              data[property] = value as T[typeof property];
              const instance = plainToInstance(Entity, data);

              const errors = await validate(instance);

              expect(errors).toEqual([
                expect.objectContaining({
                  children: expected.children.map((value1) => {
                    return 'children' in value1
                      ? expect.objectContaining({
                          children: value1.children.map((value2) => {
                            return expect.objectContaining(value2);
                          }),
                        })
                      : expect.objectContaining(value1);
                  }),
                }),
              ]);
            },
          );
        }
      });
    }

    if (cases.transform != undefined && cases.transform.length > 0) {
      describe('transform', () => {
        if (cases.transform != undefined && cases.transform.length > 0) {
          it.each(cases.transform)(
            '$#: should transform "$property"',
            ({ property, value, expected }) => {
              data[property] = value as T[typeof property];

              const instance = plainToInstance(Entity, data);

              expect(instance[property]).toEqual(expected);
            },
          );
        }
      });
    }

    describe('validation', () => {
      describe.each(cases.validation)('$property', ({ cases, property }) => {
        it.each(cases)(
          `$#: should fail if "${String(property)}" $description`,
          async ({ expected, value }) => {
            data[property] = value as T[typeof property];
            const instance = plainToInstance(Entity, data);

            const errors = await validate(instance);

            expect(errors).toEqual([
              expect.objectContaining({
                constraints: Object.fromEntries(
                  Object.entries(expected).map(([key, value]) => {
                    return [
                      key,
                      typeof value === 'function'
                        ? value(property)
                        : `${String(property)} ${value}`,
                    ];
                  }),
                ),
                property,
              }),
            ]);
          },
        );
      });
    });
  });
}
