import { Module } from '@nestjs/common';
import { AjvService } from './ajv.service.js';

@Module({
  exports: [AjvService],
  providers: [AjvService],
})
export class AjvModule {}
