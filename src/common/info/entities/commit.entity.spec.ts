import {
  entityTests,
  isString,
} from '../../testing/entity-tests.utils.spec.js';
import { Commit } from './commit.entity.js';
import { mockCommit } from './commit.entity.utils.spec.js';

entityTests(Commit, mockCommit, {
  validation: [
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'sha',
    },
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'sha',
    },
  ],
});
