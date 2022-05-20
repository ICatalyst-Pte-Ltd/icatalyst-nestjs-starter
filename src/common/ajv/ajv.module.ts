import { Module } from '@nestjs/common';
import { AjvService } from './ajv.service';

@Module({
  exports: [AjvService],
  providers: [AjvService],
})
export class AjvModule {}
