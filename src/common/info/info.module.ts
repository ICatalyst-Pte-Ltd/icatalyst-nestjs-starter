import { Module } from '@nestjs/common';
import { AppConfig } from '../../app.config.js';
import { InfoController } from './info.controller.js';
import { InfoService } from './info.service.js';
import { RegistryService } from './registry.service.js';

@Module({
  controllers: [InfoController],
  exports: [RegistryService],
  providers: [
    AppConfig,
    InfoService,
    { provide: RegistryService, useFactory: RegistryService.getInstance },
  ],
})
export class InfoModule {}
