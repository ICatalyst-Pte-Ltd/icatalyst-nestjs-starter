import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AbstractInfo, RegistryService } from '../info/index.js';
import { NAME } from './gotenberg.constants.js';
import { GotenbergService } from './gotenberg.service.js';
import { GotenbergHealth } from './gotenberg.types.js';

@Injectable()
export class GotenbergInfo extends AbstractInfo<GotenbergHealth> {
  constructor(
    private readonly gotenberg: GotenbergService,
    registry: RegistryService,
  ) {
    super(NAME, registry);
  }

  info(): Observable<GotenbergHealth> {
    return this.gotenberg.health();
  }
}
