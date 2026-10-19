import {
  entityTests,
  isSemVer,
} from '../../testing/entity-tests.utils.spec.js';
import { Build } from './build.entity.js';
import { mockBuild } from './build.entity.utils.spec.js';

entityTests(Build, mockBuild, {
  validation: [
    {
      cases: [
        {
          description: 'is a  blank string',
          expected: { isSemVer },
          value: '',
        },
      ],
      property: 'version',
    },
  ],
});
