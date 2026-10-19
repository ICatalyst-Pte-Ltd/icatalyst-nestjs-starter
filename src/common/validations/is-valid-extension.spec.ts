import { validate } from 'class-validator';
import { IsValidExtension } from './is-valid-extension.js';

class TestDto {
  @IsValidExtension(['png', 'jpg'])
  extension!: string;
}

describe(IsValidExtension.name, () => {
  it('should pass validation when the extension is allowed', async () => {
    const instance = Object.assign(new TestDto(), { extension: 'png' });

    const errors = await validate(instance);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation when the extension is not allowed', async () => {
    const instance = Object.assign(new TestDto(), { extension: 'exe' });

    const errors = await validate(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      IsValidExtensionConstraint: 'Extension is not valid',
    });
  });
});
