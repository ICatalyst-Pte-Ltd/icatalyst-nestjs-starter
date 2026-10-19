import { randomInt } from 'node:crypto';
import { BIGINT } from './big-int.js';
import { regExpTests } from './regex.utils.spec.js';

regExpTests(
  'BIGINT',
  BIGINT,
  () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890';
    return [
      { expected: false, value: '' },
      { expected: false, value: '-' },
      { expected: false, value: letters },
      { expected: true, value: numbers },
      { expected: false, value: `${letters}${numbers}` },
      { expected: false, value: '-123' },
      { expected: false, value: '123-' },
      { expected: true, value: `${randomInt(1000)}` },
    ];
  },
  false,
);
