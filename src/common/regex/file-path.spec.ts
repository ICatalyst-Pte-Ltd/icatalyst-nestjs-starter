import { FILE_PATH } from './file-path.js';
import { regExpTests } from './regex.utils.spec.js';

regExpTests(
  'FILE_PATH',
  FILE_PATH,
  [
    { expected: false, value: '_file' },
    { expected: false, value: 'file_' },
    { expected: true, value: 'file123' },
    { expected: true, value: 'file-123' },
    { expected: true, value: 'file_123' },
    { expected: false, value: 'file@123' },
    { expected: false, value: 'file#123' },
    { expected: true, value: 'file 123' },
  ],
  false,
);
