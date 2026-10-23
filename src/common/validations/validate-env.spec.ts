import { AnySchema } from 'joi';
import { validateEnv } from './validate-env.js';
import { randomUUID } from 'crypto';

describe(validateEnv.name, () => {
  it('should call the validate() function', () => {
    const value = { value: { id: randomUUID() } };
    const validate = vi.fn().mockReturnValue(value);
    const schema = { validate } as unknown as AnySchema;

    const result = validateEnv(schema);

    expect(result).toEqual(value.value);
    expect(validate).toHaveBeenCalledWith(process.env, {
      allowUnknown: true,
      context: undefined,
      stripUnknown: true,
    });
  });

  it('should throw an error', () => {
    const value = { error: new Error('some error') };
    const schema = {
      validate: vi.fn().mockReturnValue(value),
    } as unknown as AnySchema;

    function f() {
      validateEnv(schema);
    }

    expect(f).toThrow(value.error);
  });
});
