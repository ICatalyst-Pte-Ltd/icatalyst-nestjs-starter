import { AnySchema, Context } from 'joi';

export function validateEnv<T>(
  schema: AnySchema<T>,
  context: Context | undefined = undefined,
): T {
  const { value, error } = schema.validate(process.env, {
    // allow unknown keys since the process.env contains many variables
    // otherwise, validation will result in errors
    allowUnknown: true,
    context,
    // remove unknown keys from resulting object
    stripUnknown: true,
  });
  if (error) {
    throw error;
  }
  return value;
}
