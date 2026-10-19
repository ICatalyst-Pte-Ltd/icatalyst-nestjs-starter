import { validate } from 'class-validator';
import { IsValidType } from './is-valid-type.js';

class TestDto {
  @IsValidType(['image/png', 'image/bmp'])
  type!: string;
}

describe(IsValidType.name, () => {
  it('should pass validation when the type is allowed', async () => {
    const instance = Object.assign(new TestDto(), { type: 'image/png' });

    const errors = await validate(instance);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation when the type is not allowed', async () => {
    const instance = Object.assign(new TestDto(), { type: 'text/html' });

    const errors = await validate(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      IsValidTypeConstraint: 'Type is not valid.',
    });
  });
});
