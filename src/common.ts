import { MissingEnvironmentVariableError } from './errors';

/**
 * Retrieve the value of an environment variable.
 *
 * @param name - the name of the environment variable
 * @param defaultFunction - a function to compute the default value if either the environment variable is undefined
 *  or a blank value is not allowed
 * @param disallowBlank - if `true` then a blank value is not allowed, otherwise (default) a blank value is allowed
 * @returns the value of the environment variable
 * @throws {@link MissingEnvironmentVariableError}
 * Thrown if either (1) the environment variable is undefined and there is no default,
 * or (2) the environment variable is blank, there is no default, and blank is not allowed.
 */
export function env(
  name: string,
  defaultFunction?: () => string,
  disallowBlank = false,
): string {
  const value = process.env[name];
  if (value == undefined || (disallowBlank && value === '')) {
    if (defaultFunction == undefined) {
      throw new MissingEnvironmentVariableError(name);
    }
    return defaultFunction();
  }
  return value;
}
