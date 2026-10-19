import { TerminusModule } from '@nestjs/terminus';
import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { HealthController } from './health.controller.js';
import { HealthModule } from './health.module.js';

moduleTests(HealthModule, [HealthController, TerminusModule], {});
