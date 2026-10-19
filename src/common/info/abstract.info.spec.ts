import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { AbstractInfo } from './abstract.info.js';
import { RegistryService } from './registry.service.js';

@Injectable()
class TestInfo extends AbstractInfo {
  constructor(registry: RegistryService) {
    super('name', registry);
  }

  info(): Observable<unknown> {
    throw new Error('Method not implemented.');
  }
}

describe(AbstractInfo.name, () => {
  let info: TestInfo;
  let registry: RegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestInfo,
        { provide: RegistryService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    info = module.get(TestInfo);
    registry = module.get(RegistryService);
  });

  it('should be defined', () => {
    expect(info).toBeDefined();
    expect(info.name).toBe('name');
    expect(registry.register).toHaveBeenCalledTimes(1);
    expect(registry.register).toHaveBeenCalledWith(info);
  });
});
