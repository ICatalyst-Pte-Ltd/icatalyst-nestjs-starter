import { randomUUID } from 'node:crypto';
import { entityTests } from '../testing/entity-tests.utils.spec.js';
import { BaseEntity } from './base.entity.js';

function mockBaseEntity({
  id = randomUUID(),
  createdAt = new Date(),
  createdBy = randomUUID(),
  updatedAt = new Date(),
  updatedBy = randomUUID(),
}: Partial<BaseEntity>): BaseEntity {
  return { id, createdAt, createdBy, updatedAt, updatedBy };
}

entityTests(BaseEntity, mockBaseEntity, {
  transform: [
    {
      property: 'createdBy',
      value: "<a href='javascript:1'>CLICK</a>",
      expected: '<a>CLICK</a>',
    },
    {
      property: 'updatedBy',
      value: "<a href='javascript:1'>CLICK</a>",
      expected: '<a>CLICK</a>',
    },
  ],

  validation: [
    {
      cases: [
        {
          description: 'is an empty string',
          expected: {
            isUuid: 'must be a UUID',
          },
          value: '',
        },
      ],
      property: 'id',
    },
    {
      cases: [
        {
          description: 'is not a date',
          expected: {
            isDate: 'must be a Date instance',
          },
          value: 1,
        },
      ],
      property: 'createdAt',
    },
    {
      cases: [
        {
          description: 'is a blank string',
          expected: {
            isLength: 'must be longer than or equal to 1 characters',
          },
          value: '',
        },
        {
          description: 'is longer than 256 characters',
          expected: {
            isLength: 'must be shorter than or equal to 255 characters',
          },
          value: 'x'.repeat(256),
        },
        {
          description: 'is not a string',
          expected: {
            isLength:
              'must be longer than or equal to 1 and shorter than or equal to 255 characters',
            isString: 'must be a string',
          },
          value: 1,
        },
      ],
      property: 'createdBy',
    },
    {
      cases: [
        {
          description: 'is not a date',
          expected: {
            isDate: 'must be a Date instance',
          },
          value: 1,
        },
      ],
      property: 'updatedAt',
    },
  ],
});
