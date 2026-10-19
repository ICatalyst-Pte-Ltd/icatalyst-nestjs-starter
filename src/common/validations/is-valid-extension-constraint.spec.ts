import { IsValidExtensionConstraint } from './is-valid-extension-constraint.js';

describe('IsValidExtensionConstraint', () => {
  let constraint: IsValidExtensionConstraint;

  beforeEach(() => {
    constraint = new IsValidExtensionConstraint();
  });

  it.each([
    {
      value: '_invalidextension',
      expected: false,
      description: 'not in the valid list',
    },
    {
      value: '.png',
      expected: true,
      description: 'is a valid extension',
    },
  ])(
    'should return $expected when the extension $description',
    ({ value, expected }) => {
      expect(
        constraint.validate(value, {
          constraints: ['.png', '.bmp'],
          value: 'fileExtension',
          targetName: 'FilesService',
          object: {},
          property: 'fileExtension',
        }),
      ).toBe(expected);
    },
  );

  it('should return the default error message', () => {
    expect(constraint.defaultMessage()).toBe('Extension is not valid');
  });
});
