import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { EventEmitterConfig } from './event-emitter.config.js';
import { EventEmitterModule } from './event-emitter.module.js';
import { EventEmitterService } from './event-emitter.service.js';

moduleTests(EventEmitterModule, [EventEmitter2, EventEmitterService], {});

describe(`${EventEmitterModule.name} configuration`, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [EventEmitterModule] })
      .overrideProvider(EventEmitterConfig)
      .useValue({ maxListeners: 25 })
      .compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should set the max listeners of the EventEmitter2 from the config', () => {
    const emitter = module.get(EventEmitter2);

    expect(emitter.getMaxListeners()).toBe(25);
  });
});
