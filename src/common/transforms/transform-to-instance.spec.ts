import { toInstance } from './transform-to-instance.js';

describe(toInstance.name, () => {
  class X {}

  it.each([
    { expected: '', options: {}, value: '' },
    { expected: 'true', options: {}, value: 'true' },
    { expected: 1, options: {}, value: 1 },
    { expected: true, options: {}, value: true },
    { expected: undefined, options: {}, value: undefined },
    { expected: null, options: {}, value: null },
    // valid JSON string representing an object
    { expected: expect.any(X), options: {}, value: '{"a":1}' },
    // valid plain object
    { expected: expect.any(X), options: {}, value: { a: 1 } },
    // valid JSON but not an object (number)
    { expected: '1234', options: {}, value: '1234' },
    // valid JSON but not an object (array)
    { expected: '[1,2,3]', options: {}, value: '[1,2,3]' },
    // malformed JSON string
    { expected: '{a:1}', options: {}, value: '{a:1}' },
    { expected: '{"a":}', options: {}, value: '{"a":}' },
    // object with null prototype
    { expected: expect.any(X), options: {}, value: Object.create(null) },
    // empty object
    { expected: expect.any(X), options: {}, value: {} },
    // stringified empty object
    { expected: expect.any(X), options: {}, value: '{}' },
    // deeply nested object
    { expected: expect.any(X), options: {}, value: { nested: { deep: true } } },
    // empty array
    { expected: [], options: {}, value: [] },
    {
      expected: [expect.any(X), expect.any(X)],
      options: { array: true },
      value: JSON.stringify([{}, { a: '2' }]),
    },
  ])(
    '$#: should transform `$value` to $expected',
    ({ value, options, expected }) => {
      const result = toInstance(X, value, options);

      expect(result).toEqual(expected);
    },
  );
});
