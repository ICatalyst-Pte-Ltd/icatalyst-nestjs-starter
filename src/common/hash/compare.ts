import { timingSafeEqual } from 'node:crypto';
import { DEFAULT_ENCODING } from './constants.js';
import { createHash } from './create-hash.js';

/**
 * Compare a password against a hash.
 *
 * @param password the password to compare against the hash.
 * @param hashAndSalt the hash to compare against the password.
 * @param encoding the encoding of the hash.
 * @returns `true` if the password matches the hash, `false` otherwise.
 */
export function compare(
  password: string | Buffer,
  hashAndSalt: string,
  encoding: BufferEncoding = DEFAULT_ENCODING,
): boolean {
  const [hash1, salt] = hashAndSalt.split('.');
  const [hash2] = createHash(password, Buffer.from(salt, encoding)).split('.');
  return timingSafeEqual(
    Buffer.from(hash1, encoding),
    Buffer.from(hash2, encoding),
  );
}
