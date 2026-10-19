import { Test } from '@nestjs/testing';
import { firstValueFrom, of } from 'rxjs';
import { RegistryService } from '../info/index.js';
import { GotenbergInfo } from './gotenberg.info.js';
import { GotenbergService } from './gotenberg.service.js';
import { GotenbergHealth } from './gotenberg.types.js';

describe(GotenbergInfo.name, () => {
  let info: GotenbergInfo;
  let gotenberg: GotenbergService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GotenbergInfo,
        { provide: GotenbergService, useValue: {} },
        { provide: RegistryService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    info = module.get(GotenbergInfo);
    gotenberg = module.get(GotenbergService);
  });

  it('should be defined', () => {
    expect(info).toBeDefined();
    expect(info.name).toBe('gotenberg');
  });

  describe(GotenbergInfo.prototype.info.name, () => {
    it('should return the health of Gotenberg', async () => {
      const value: GotenbergHealth = {
        responseTimeInMilliseconds: 1,
        status: 'up',
      };
      gotenberg.health = vi.fn().mockReturnValue(of(value));

      const result = await firstValueFrom(info.info());

      expect(result).toBe(value);
      expect(gotenberg.health).toHaveBeenCalledTimes(1);
    });
  });
});
