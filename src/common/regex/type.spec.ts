import { regExpTests } from './regex.utils.spec.js';
import { TYPE } from './type.js';

regExpTests(
  'TYPE',
  TYPE,
  [
    { expected: true, value: 'a' },
    { expected: true, value: 'a1b' },
    { expected: true, value: 'a_b' },
    { expected: true, value: 'a_1_b' },
    { expected: false, value: '' },
    { expected: false, value: ' ' },
    { expected: false, value: 'a1' },
    { expected: false, value: '1a' },
    { expected: false, value: 'a_' },
    { expected: false, value: '_a' },
  ],
  false,
);
