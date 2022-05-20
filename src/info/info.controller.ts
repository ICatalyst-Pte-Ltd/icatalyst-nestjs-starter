import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { InfoService } from './info.service';

/**
 * The controller of the info module
 */
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  /**
   * Retrieve information about this application
   *
   * @returns information about this application
   */
  @Get()
  @Version(VERSION_NEUTRAL)
  getInfo() {
    return this.infoService.getInfo();
  }
}
