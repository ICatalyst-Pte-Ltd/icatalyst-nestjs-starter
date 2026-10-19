import { AppConfig } from '../../app.config.js';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { GotenbergConfig } from './gotenberg.config.js';
import { GotenbergHealthIndicator } from './gotenberg.health.js';
import { GotenbergInfo } from './gotenberg.info.js';
import { GotenbergModule } from './gotenberg.module.js';
import { GotenbergService } from './gotenberg.service.js';

moduleTests(
  GotenbergModule,
  [GotenbergConfig, GotenbergHealthIndicator, GotenbergInfo, GotenbergService],
  {
    beforeEachFn(builder) {
      return builder
        .overrideProvider(AppConfig)
        .useValue({})
        .overrideProvider(GotenbergConfig)
        .useValue({ url: 'http://localhost:4000' });
    },
    afterEachFn: async (module) => {
      await module.close();
    },
  },
);
