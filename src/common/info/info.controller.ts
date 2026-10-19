import { Observable } from 'rxjs';
import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { SkipAuthentication } from '../auth/index.js';
import { Info } from './entities/info.entity.js';
import { InfoService } from './info.service.js';

/**
 * The controller of the info module
 */
@Controller('info')
@SkipAuthentication()
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  /**
   * Retrieve information about this application
   *
   * @returns information about this application
   */
  @Get()
  @Version(VERSION_NEUTRAL)
  getInfo(): Observable<Info> {
    return this.infoService.getInfo();
  }
}
