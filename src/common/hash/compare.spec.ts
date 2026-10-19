import { compare } from './compare.js';
import { createHash } from './create-hash.js';

describe(compare.name, () => {
  it.each([
    {
      password: 'password',
      hash: '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6.73616c74',
      expected: true,
    },
  ])(
    '$#: should return $expected for (password=$password, hash=$hash)',
    ({ password, hash, expected }) => {
      const h = createHash(password, 'salt');
      expect(h).toBe(hash);

      const result = compare(password, h);

      expect(result).toBe(expected);
    },
  );
});
