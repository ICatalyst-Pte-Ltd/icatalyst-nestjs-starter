import { DEFAULT_PATH } from './constants.js';
import { IsValidPathConstraint } from './is-valid-path-constraint.js';

describe('IsValidPathConstraint', () => {
  let constraint: IsValidPathConstraint;

  beforeEach(() => {
    constraint = new IsValidPathConstraint();
  });

  it.each([
    {
      value: '_invalidpath',
      expected: false,
      description: 'starts with underscore',
    },
    {
      value: 'invalidpath_',
      expected: false,
      description: 'ends with underscore',
    },
    {
      value: 'invalid*path',
      expected: false,
      description: 'contains asterisk',
    },
    {
      value: 'valid path',
      expected: true,
      description: 'is a valid path with space',
    },
    {
      value: 'valid-path',
      expected: true,
      description: 'is a valid path with hyphen',
    },
    {
      value: 'valid_path',
      expected: true,
      description: 'is a valid path with underscore',
    },
    {
      value: 'validpath123',
      expected: true,
      description: 'is a valid alphanumeric path',
    },
    {
      value: 'valid123path',
      expected: true,
      description: 'is another valid alphanumeric path',
    },
    {
      value: 'valid-path_123',
      expected: true,
      description: 'is a valid path with hyphen, underscore, and numbers',
    },
    {
      value: '/',
      expected: true,
      description: 'is a single slash',
    },
    {
      value: '/valid',
      expected: true,
      description: 'is a valid path with leading slash',
    },
    {
      value: '/valid-path',
      expected: true,
      description: 'is a valid path with leading slash and hyphen',
    },
    {
      value: '/123-valid',
      expected: true,
      description:
        'is a valid path with leading slash and alphanumeric characters',
    },
    {
      value: '/no',
      expected: false,
      description: 'is less than 4 characters after replacement',
    },
    {
      value: '/ab',
      expected: false,
      description: 'is less than 4 characters after replacement',
    },
    {
      value: '/12',
      expected: false,
      description: 'is less than 4 characters after replacement',
    },
    {
      value: `${DEFAULT_PATH}valid-path${DEFAULT_PATH}`,
      expected: true,
      description: 'is a valid after replacement',
    },
  ])(
    'should return $expected when the path $description',
    ({ value, expected }) => {
      expect(constraint.validate(value)).toBe(expected);
    },
  );

  it('should return the default error message', () => {
    expect(constraint.defaultMessage()).toBe('Path ($value) is not valid!');
  });
});
