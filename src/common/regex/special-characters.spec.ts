import { regExpTests } from './regex.utils.spec.js';
import { SPECIAL_CHARACTERS } from './special-characters.js';

regExpTests(
  'SPECIAL_CHARACTERS',
  SPECIAL_CHARACTERS,
  () => {
    const special = ['=', '+', '-', '@'];
    return [
      { expected: false, value: '' },
      { expected: false, value: ' ' },
      ...special.map((value) => {
        return { expected: true, value: `${value}abc123` };
      }),
      { expected: false, value: ' ' },
      ...special.map((value) => {
        return { expected: true, value: `"${value}abc123` };
      }),
      ...special.map((value) => {
        return { expected: false, value: `abc123${value}` };
      }),
      { expected: false, value: 'abcdefgh ijklmnopqrstuvwxyz1234567890' },
      { expected: false, value: '"abcdefgh ijklmnopqrstuvwxyz1234567890' },
      { expected: false, value: '1234567890' },
      ...special.map((value) => {
        return { expected: false, value: `abc${value}123` };
      }),
      { expected: false, value: 'SIMpleTest' },
      { expected: true, value: '=simpletest' },
    ];
  },
  false,
);
