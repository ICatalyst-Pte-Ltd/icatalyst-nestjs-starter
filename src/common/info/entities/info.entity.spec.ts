import {
  entityTests,
  isObject,
  isSemVer,
  isString,
  isUrl,
} from '../../testing/entity-tests.utils.spec.js';
import { mockBuild } from './build.entity.utils.spec.js';
import { mockCI } from './ci.entity.utils.spec.js';
import { mockGit } from './git.entity.utils.spec.js';
import { Info } from './info.entity.js';
import { mockInfo } from './info.entity.utils.spec.js';

entityTests(Info, mockInfo, {
  nested: [
    {
      expected: {
        children: [{ constraints: { isSemVer: isSemVer('version') } }],
      },
      property: 'build',
      value: mockBuild({ version: '' }),
    },
    {
      expected: {
        children: [{ constraints: { isUrl: isUrl('pipelineUrl') } }],
      },
      property: 'ci',
      value: mockCI({ pipelineUrl: '' }),
    },
    {
      expected: {
        children: [{ constraints: { isString: isString('branch') } }],
      },
      property: 'git',
      value: mockGit({ branch: 1 as unknown as string }),
    },
  ],
  validation: [
    {
      cases: [
        { description: 'is not an object', expected: { isObject }, value: 1 },
      ],
      property: 'extensions',
    },
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'name',
    },
    {
      cases: [
        {
          description: 'is a blank string',
          expected: { isUrl },
          value: '',
        },
      ],
      property: 'url',
    },
  ],
});
