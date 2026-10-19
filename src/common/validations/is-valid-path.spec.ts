import { validate } from 'class-validator';
import { IsValidPath } from './is-valid-path.js';

class TestDto {
  @IsValidPath()
  path!: string;
}

describe(IsValidPath.name, () => {
  it.each(['/', '/folder/'])(
    '$#: should pass validation when the path is %s',
    async (path) => {
      const instance = Object.assign(new TestDto(), { path });

      const errors = await validate(instance);

      expect(errors).toHaveLength(0);
    },
  );

  it('should fail validation when the path is not valid', async () => {
    const instance = Object.assign(new TestDto(), { path: '/a/' });

    const errors = await validate(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      IsValidPathConstraint: 'Path (/a/) is not valid!',
    });
  });
});
