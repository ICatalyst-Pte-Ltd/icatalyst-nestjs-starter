import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { RedisConfig } from './redis.config.js';
import { RedisModule } from './redis.module.js';

moduleTests(RedisModule, [RedisConfig], {});
