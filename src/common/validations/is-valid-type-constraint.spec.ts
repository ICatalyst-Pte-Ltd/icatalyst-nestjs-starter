import { IsValidTypeConstraint } from './is-valid-type-constraint.js';

describe('IsValidTypeConstraint', () => {
  let constraint: IsValidTypeConstraint;

  beforeEach(() => {
    constraint = new IsValidTypeConstraint();
  });

  it.each([
    {
      value: '_invalidtype',
      expected: false,
      description: 'not in the valid list',
    },
    {
      value: 'image/png',
      expected: true,
      description: 'is a valid type',
    },
  ])(
    'should return $expected when the type $description',
    ({ value, expected }) => {
      expect(
        constraint.validate(value, {
          constraints: ['image/png', 'image/bmp'],
          value: 'mimeType',
          targetName: 'FilesService',
          object: {},
          property: 'mimeType',
        }),
      ).toBe(expected);
    },
  );

  it('should return the default error message', () => {
    expect(constraint.defaultMessage()).toBe('Type is not valid.');
  });
});
