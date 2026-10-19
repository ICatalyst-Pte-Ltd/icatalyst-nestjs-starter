import { validate } from 'class-validator';
import { ExactlyOneOf } from './exactly-one-of.js';

class TestDto {
  propertyOne?: string;

  propertyTwo?: string;

  @ExactlyOneOf(['propertyOne', 'propertyTwo'])
  private readonly _mode!: never;
}

describe(ExactlyOneOf.name, () => {
  it('should validate when only one property is provided', async () => {
    const instance = new TestDto();
    instance.propertyOne = 'value';

    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should fail validation when more than one property is provided', async () => {
    const instance = new TestDto();
    instance.propertyOne = 'valueOne';
    instance.propertyTwo = 'valueTwo';

    const errors = await validate(instance);

    expect(errors.length).toBe(1);
  });

  it('should fail validation when no property is provided', async () => {
    const instance = new TestDto();

    const errors = await validate(instance);

    expect(errors.length).toBe(1);
  });
});
