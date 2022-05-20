import { randomUUID } from 'crypto';
import { AnySchema } from 'joi';
import { validateEnv } from './validations';

describe(validateEnv.name, () => {
  it('should call the validate() function', () => {
    const value = { value: { id: randomUUID() } };
    const schema = {
      validate: jest.fn().mockReturnValue(value),
    } as unknown as AnySchema;

    const result = validateEnv(schema);

    expect(result).toEqual(value.value);
    expect(schema.validate).toBeCalledWith(process.env, {
      allowUnknown: true,
      context: undefined,
      stripUnknown: true,
    });
  });

  it('should throw an error', () => {
    const value = { error: new Error('some error') };
    const schema = {
      validate: jest.fn().mockReturnValue(value),
    } as unknown as AnySchema;

    function f() {
      validateEnv(schema);
    }

    expect(f).toThrowError(value.error);
  });
});
