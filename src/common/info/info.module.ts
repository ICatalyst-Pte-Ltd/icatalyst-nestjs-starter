import { Module } from '@nestjs/common';
import { AppConfig } from '../../app.config.js';
import { InfoController } from './info.controller.js';
import { InfoService } from './info.service.js';

@Module({
  controllers: [InfoController],
  providers: [AppConfig, InfoService],
})
export class InfoModule {}
