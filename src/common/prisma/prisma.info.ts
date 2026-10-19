import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AbstractInfo, RegistryService } from '../info/index.js';
import { NAME } from './prisma.constants.js';
import { PrismaService } from './prisma.service.js';
import { PrismaHealth } from './types.js';

@Injectable()
export class PrismaInfo extends AbstractInfo<PrismaHealth> {
  constructor(
    private readonly prisma: PrismaService,
    registry: RegistryService,
  ) {
    super(NAME, registry);
  }

  info(): Observable<PrismaHealth> {
    return this.prisma.health();
  }
}
