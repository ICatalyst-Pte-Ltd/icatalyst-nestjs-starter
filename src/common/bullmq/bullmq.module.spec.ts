import { getSharedConfigToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisConfig } from '../redis/index.js';
import { BullMQModule } from './bullmq.module.js';

describe(BullMQModule.name, () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({ imports: [BullMQModule] })
      .overrideProvider(RedisConfig)
      .useValue({ host: 'redis', port: 1234 })
      .compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module.get(BullMQModule)).toBeDefined();
  });

  it('should connect to Redis using the RedisConfig', () => {
    const options = module.get(getSharedConfigToken());

    expect(options).toEqual({ connection: { host: 'redis', port: 1234 } });
  });
});
