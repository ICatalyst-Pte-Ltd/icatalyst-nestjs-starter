import { moduleTests } from '../../testing/module-tests.utils.spec.js';
import { CursorPaginationStrategy } from './cursor-pagination.strategy.js';
import { OffsetPaginationStrategy } from './offset-pagination.strategy.js';
import { PaginationModule } from './pagination.module.js';
import { PaginationService } from './pagination.service.js';

moduleTests(
  PaginationModule,
  [CursorPaginationStrategy, OffsetPaginationStrategy, PaginationService],
  {},
);
