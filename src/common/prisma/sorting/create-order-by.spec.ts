import { Prisma } from '~prisma/client.js';
import { IsUUID } from 'class-validator';
import {
  entityTests,
  isArray,
  isEnum,
  nestedValidationEach,
} from '../../testing/entity-tests.utils.spec.js';
import { createOrderBy } from './create-order-by.js';

describe(createOrderBy.name, () => {
  class Test {
    @IsUUID()
    id!: string;

    @IsUUID()
    property1!: string;
  }

  it('should be named correctly', () => {
    const OrderTestBy = createOrderBy(Test, ['id']);

    expect(OrderTestBy.name).toBe('OrderTestBy');
  });

  describe('entity', () => {
    class OrderTestBy extends createOrderBy(Test, ['id', 'property1']) {}

    function mockOrderTestBy({
      orderBy = [],
    }: Partial<OrderTestBy>): OrderTestBy {
      return { orderBy };
    }

    entityTests(OrderTestBy, mockOrderTestBy, {
      nested: [
        {
          expected: {
            children: [
              {
                children: [
                  {
                    constraints: {
                      isEnum: isEnum(Prisma.SortOrder)('id'),
                    },
                  },
                ],
              },
            ],
          },
          property: 'orderBy',
          value: [{ id: '' }],
        },
      ],
      validation: [
        {
          cases: [
            {
              description: 'is an object',
              expected: {
                isArray,
              },
              value: {},
            },
            {
              description: 'is a string',
              expected: {
                isArray,
                nestedValidation: nestedValidationEach,
              },
              value: '',
            },
          ],
          property: 'orderBy',
        },
      ],
    });
  });
});
