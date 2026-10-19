import { ValidationError } from 'joi';

/**
 * Type to represent classes that use the empty constructors.
 */
type ConfigClass<T> = new () => T;

/**
 * Represents a test case.
 */
interface ConfigTestCase<E = unknown> {
  /**
   * The expected value.
   */
  expected: E;
  /**
   * The value assigned to the environment variable.
   */
  value?: string;
}

interface Error {
  /**
   * Either a string or a function that returns a string
   * of the error message.
   */
  message: string | ((value?: string) => string);
}

/**
 * An error case.
 */
interface ConfigErrorTestCase extends ConfigTestCase<Error> {
  /**
   * A description of the test case.
   */
  description: string;
}

interface ConfigTestCases<P, V> {
  /**
   * The different types test cases.
   */
  cases: {
    /**
     * Test cases that cause validation errors.
     */
    error?: ReadonlyArray<ConfigErrorTestCase>;
    /**
     * Test cases that are expected to pass validation without errors and produce
     * results that exactly or match the expected values.
     */
    good?: ReadonlyArray<ConfigTestCase>;
  };
  /**
   * A property from the config class.
   */
  property: Extract<keyof P, string>;
  /**
   * An environment variable.
   */
  variable: Extract<keyof V, string>;
}

type ClassProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

/**
 * A standardized set of tests for config classes.
 *
 * @param Config the config class to test.
 * @param variables the environment variables to set.
 * @param properties the properties of the config class.
 * @param cases the test cases.
 */
export function configTests<T, V extends Record<string, string>>(
  Config: ConfigClass<T>,
  variables: V,
  properties: ClassProperties<T>,
  cases: ReadonlyArray<ConfigTestCases<ClassProperties<T>, V>>,
): void {
  describe(Config.name, () => {
    const env = { ...process.env };

    beforeEach(() => {
      process.env = { ...env, ...variables };
    });

    afterAll(() => {
      process.env = { ...env };
    });

    it('should read from the environment variables', () => {
      const config = new Config();

      expect(config).toEqual(properties);
    });

    describe.each(cases)('$variable', ({ cases, property, variable }) => {
      if (cases.error !== undefined && cases.error.length > 0) {
        it.each(cases.error)(
          '$#: should throw a ValidationError if the value $description',
          ({ expected, value }) => {
            process.env[variable] = value;

            const message = expected.message;
            expect(() => new Config()).toThrow(ValidationError);
            expect(() => new Config()).toThrow(
              expect.objectContaining({
                message: `"${variable}" ${typeof message === 'function' ? message(value) : message}`,
              }),
            );
          },
        );
      }

      if (cases.good !== undefined && cases.good.length > 0) {
        it.each(cases.good)(
          '$#: should be "$expected" or match if the value is "$value"',
          ({ expected, value }) => {
            process.env[variable] = value;

            const config = new Config();

            if (expected instanceof RegExp) {
              expect(config[property]).toMatch(expected);
            } else {
              expect(config[property]).toBe(expected);
            }
          },
        );
      }
    });
  });
}
