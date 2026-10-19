import { Module } from '@nestjs/common';
import { CursorPaginationStrategy } from './cursor-pagination.strategy.js';
import { OffsetPaginationStrategy } from './offset-pagination.strategy.js';
import { PaginationService } from './pagination.service.js';

@Module({
  exports: [PaginationService],
  providers: [
    CursorPaginationStrategy,
    OffsetPaginationStrategy,
    PaginationService,
  ],
})
export class PaginationModule {}
