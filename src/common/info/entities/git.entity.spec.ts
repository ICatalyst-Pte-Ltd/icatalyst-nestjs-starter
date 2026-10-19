import {
  entityTests,
  isString,
} from '../../testing/entity-tests.utils.spec.js';
import { mockCommit } from './commit.entity.utils.spec.js';
import { Git } from './git.entity.js';
import { mockGit } from './git.entity.utils.spec.js';

entityTests(Git, mockGit, {
  nested: [
    {
      expected: {
        children: [{ constraints: { isString: isString('sha') } }],
      },
      property: 'commit',
      value: mockCommit({ sha: 1 as unknown as string }),
    },
  ],
  validation: [
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'branch',
    },
  ],
});
