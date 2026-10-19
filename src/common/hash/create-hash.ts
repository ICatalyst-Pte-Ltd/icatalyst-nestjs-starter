import { randomBytes, scryptSync } from 'node:crypto';
import {
  DEFAULT_ENCODING,
  DEFAULT_HASH_SIZE,
  DEFAULT_SALT_SIZE,
} from './constants.js';

/**
 * Create a hash from the given `password`.
 *
 * @param password the password to hash.
 * @param salt an optional salt; defaults to a random 32 byte buffer.
 * @param hashSize an optional size of the hash; defaults to 64 bytes.
 * @param encoding an optional encoding of the hash; defaults to hex.
 * @returns a hash of the password and the salt in the form of '<hash>.<salt>'.
 */
export function createHash(
  password: string | Buffer,
  salt: string | Buffer = randomBytes(DEFAULT_SALT_SIZE),
  hashSize = DEFAULT_HASH_SIZE,
  encoding: BufferEncoding = DEFAULT_ENCODING,
): string {
  if (typeof password === 'string') {
    password = Buffer.from(password);
  }
  if (typeof salt === 'string') {
    salt = Buffer.from(salt);
  }
  const hash = scryptSync(password, salt, hashSize);
  return `${hash.toString(encoding)}.${salt.toString(encoding)}`;
}
