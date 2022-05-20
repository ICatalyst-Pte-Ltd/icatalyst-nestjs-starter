import { MissingEnvironmentVariableError } from './errors';

export function env(
  name: string,
  defaultFunction?: () => string,
  includeBlank = false,
): string {
  const value = process.env[name];
  if (value == undefined || (includeBlank && value === '')) {
    if (defaultFunction == undefined) {
      throw new MissingEnvironmentVariableError(name);
    }
    return defaultFunction();
  }
  return value;
}
