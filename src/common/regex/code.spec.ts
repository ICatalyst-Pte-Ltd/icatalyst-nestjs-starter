import { CODE } from './code.js';
import { regExpTests } from './regex.utils.spec.js';

regExpTests(
  'CODE',
  CODE,
  () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return [
      { expected: false, value: '' },
      { expected: false, value: '_' },
      { expected: false, value: `${letters}` },
      { expected: false, value: `${letters}_${letters}` },
      { expected: true, value: `${letters}_${letters}_${letters}` },
      { expected: false, value: `_${letters}_${letters}_${letters}` },
      { expected: false, value: `${letters}_${letters}_${letters}_` },
      { expected: false, value: `${letters}_1_${letters}` },
      { expected: true, value: `${letters}_${letters}_${letters}_${letters}` },
    ];
  },
  false,
);
