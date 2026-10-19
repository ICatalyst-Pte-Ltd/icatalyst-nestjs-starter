import { moduleTests } from '../testing/module-tests.utils.spec.js';
import { AjvModule } from './ajv.module.js';
import { AjvService } from './ajv.service.js';

moduleTests(AjvModule, [AjvService], {});
