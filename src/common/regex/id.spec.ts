import { randomUUID } from 'node:crypto';
import { ID } from './id.js';
import { regExpTests } from './regex.utils.spec.js';

regExpTests(
  'ID',
  ID,
  () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890';
    return [
      { expected: false, value: '' },
      { expected: false, value: '-' },
      { expected: true, value: letters },
      { expected: true, value: numbers },
      { expected: true, value: `${letters}${numbers}` },
      { expected: false, value: '-a' },
      { expected: false, value: 'a-' },
      { expected: false, value: letters.at(0)!.toUpperCase() },
      { expected: true, value: randomUUID() },
    ];
  },
  false,
);
