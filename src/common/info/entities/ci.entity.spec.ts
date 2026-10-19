import {
  entityTests,
  isString,
  isUrl,
} from '../../testing/entity-tests.utils.spec.js';
import { CI } from './ci.entity.js';
import { mockCI } from './ci.entity.utils.spec.js';

entityTests(CI, mockCI, {
  validation: [
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'pipelineId',
    },
    {
      cases: [
        { description: 'is not a string', expected: { isString }, value: 1 },
      ],
      property: 'pipelineInternalId',
    },
    {
      cases: [{ description: 'is not a URL', expected: { isUrl }, value: '' }],
      property: 'pipelineUrl',
    },
  ],
});
