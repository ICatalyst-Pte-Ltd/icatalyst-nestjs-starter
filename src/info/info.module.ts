import { Module } from '@nestjs/common';
import { AppConfig } from '../app.config';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  controllers: [InfoController],
  providers: [AppConfig, InfoService],
})
export class InfoModule {}
