import { AppConfig } from '../../app.config.js';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { InfoController } from './info.controller.js';
import { InfoModule } from './info.module.js';
import { InfoService } from './info.service.js';

moduleTests(InfoModule, [InfoController, AppConfig, InfoService], {
  beforeEachFn(builder) {
    return builder.overrideProvider(AppConfig).useValue({});
  },
});
