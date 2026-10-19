import { configTests } from '../testing/config-tests.utils.spec.js';
import { EventEmitterConfig } from './event-emitter.config.js';

configTests(
  EventEmitterConfig,
  {
    EVENT_EMITTER_MAX_LISTENERS: '49',
  },
  {
    maxListeners: 49,
  },
  [
    {
      cases: {
        error: [
          {
            description: 'not greater than or equal to 1',
            expected: { message: 'must be greater than or equal to 1' },
            value: '0',
          },
          {
            description: 'not less than or equal to 50',
            expected: { message: 'must be less than or equal to 50' },
            value: '51',
          },
        ],
        good: [{ expected: 10, value: undefined }],
      },
      property: 'maxListeners',
      variable: 'EVENT_EMITTER_MAX_LISTENERS',
    },
  ],
);
