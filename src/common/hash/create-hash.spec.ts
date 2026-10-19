import { createHash } from './create-hash.js';

describe(createHash.name, () => {
  it.each([
    {
      password: 'password',
      salt: 'salt',
      expected:
        '745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf7734ef9fd58422e2e22183bcacba9ec87ba0c83b7a2e788f03ce0da06463433cda6.73616c74',
    },
  ])(
    '$#: should return a hash for (password=$password, salt=$salt)',
    ({ password, salt, expected }) => {
      const hash = createHash(password, salt);

      expect(hash).toBe(expected);
    },
  );

  it('should return the same hash for Buffer and string inputs', () => {
    const hash = createHash(Buffer.from('password'), Buffer.from('salt'));

    expect(hash).toBe(createHash('password', 'salt'));
  });

  it('should use a random salt by default', () => {
    const [hash1, salt1] = createHash('password').split('.');
    const [hash2, salt2] = createHash('password').split('.');

    expect(salt1).not.toBe(salt2);
    expect(hash1).not.toBe(hash2);
  });
});
