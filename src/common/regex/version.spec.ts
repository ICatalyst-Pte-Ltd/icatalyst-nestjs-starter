import { regExpTests } from './regex.utils.spec.js';
import { VERSION } from './version.js';

regExpTests(
  'VERSION',
  VERSION,
  [
    { expected: false, value: '' },
    { expected: false, value: 'a' },
    { expected: true, value: '0' },
    { expected: false, value: '00' },
    { expected: true, value: '0.0' },
    { expected: false, value: '00.00' },
    { expected: true, value: '0.0.0' },
    { expected: false, value: '00.00.00' },
    { expected: false, value: '0.0.0.0' },
  ],
  false,
);
