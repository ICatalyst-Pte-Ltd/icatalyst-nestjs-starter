export class MissingEnvironmentVariableError extends Error {
  constructor(name: string) {
    super(`The '${name}' environment variable is undefined`);
  }
}
