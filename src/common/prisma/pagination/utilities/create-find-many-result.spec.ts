import { IsUUID } from 'class-validator';
import { createFindManyResult } from './create-find-many-result.js';
import {
  entityTests,
  isArray,
  isObject,
  nestedValidationEach,
} from '../../../testing/entity-tests.utils.spec.js';

describe(createFindManyResult.name, () => {
  class Test {
    @IsUUID()
    id!: string;
  }

  it('should be named correctly', () => {
    const FindManyTest = createFindManyResult(Test);

    expect(FindManyTest.name).toBe('FindManyTestResult');
  });

  describe('entity', () => {
    class FindManyTest extends createFindManyResult(Test) {}

    function mockFindManyTest({
      data = [],
      metadata = {},
    }: Partial<FindManyTest>): FindManyTest {
      return { data, metadata };
    }

    entityTests(FindManyTest, mockFindManyTest, {
      validation: [
        {
          cases: [
            {
              description: 'is a string',
              expected: {
                isArray,
                nestedValidation: nestedValidationEach,
              },
              value: '',
            },
          ],
          property: 'data',
        },
        {
          cases: [
            {
              description: 'is a string',
              expected: {
                isObject,
              },
              value: '',
            },
          ],
          property: 'metadata',
        },
      ],
    });
  });
});
