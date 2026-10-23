import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

type Class = new (...args: Array<never>) => unknown;

/**
 * The list of functions to run in the various test lifecycle hooks.
 */
interface ModuleTestFunctions {
  /**
   * Additional code to run in the {@link afterEach} block.
   *
   * @param module the {@link TestingModule}.
   */
  afterEachFn?: (module: TestingModule) => void | Promise<void>;
  /**
   * Additional code to run in the {@link beforeEach} block.
   *
   * @param builder the {@link TestingModuleBuilder}.
   */
  beforeEachFn?: (
    builder: TestingModuleBuilder,
  ) => TestingModuleBuilder | Promise<TestingModuleBuilder>;
}

/**
 * Standard set of tests for NestJS modules.
 *
 * @param Module the module to test.
 * @param cases the test cases.
 * @param param2 additional code run in the various test lifecycle hooks.
 */
export function moduleTests<T extends object>(
  Module: new () => T,
  cases: ReadonlyArray<Class>,
  { afterEachFn, beforeEachFn }: ModuleTestFunctions,
): void {
  describe(Module.name, () => {
    let module: TestingModule;

    beforeEach(async () => {
      const builder = Test.createTestingModule({
        imports: [Module],
      });
      module = await (
        beforeEachFn === undefined ? builder : await beforeEachFn(builder)
      ).compile();
    });

    afterEach(async () => {
      if (afterEachFn !== undefined) {
        await afterEachFn(module);
      }
    });

    describe.each(
      cases.map((value) => {
        return { Class: value };
      }),
    )('$Class.name', ({ Class }) => {
      it('should be defined', () => {
        const instance = module.get(Class);

        expect(instance).toBeDefined();
      });
    });
  });
}
