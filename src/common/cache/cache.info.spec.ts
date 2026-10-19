import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { RegistryService } from '../info/index.js';
import { CacheInfo } from './cache.info.js';

describe(CacheInfo.name, () => {
  let info: CacheInfo;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheInfo,
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        { provide: RegistryService, useValue: { register: vi.fn() } },
      ],
    }).compile();

    info = module.get(CacheInfo);
    cache = module.get(CACHE_MANAGER);
  });

  describe(CacheInfo.prototype.info.name, () => {
    it.each([
      {
        description: 'return the status of all stores',
        expected: {
          status: 'up',
        },
        store: {
          name: 'StoreA',
          value: 'PONG',
        },
      },
      {
        description: 'handle the case when the ping is not PONG',
        expected: {
          error: 'Invalid ping value: other',
          status: 'down',
        },
        store: {
          name: 'StoreA',
          value: 'other',
        },
      },
      {
        description: 'handle errors',
        expected: {
          status: 'down',
        },
        store: {
          name: 'StoreA',
          value: new Error('some error'),
        },
      },
    ])('$#: should $description', async ({ expected, store }) => {
      const getFn =
        store.value instanceof Error
          ? vi.fn().mockRejectedValue(store.value)
          : vi.fn().mockResolvedValue(store.value);
      const setFn = vi.fn().mockResolvedValue(true);
      cache.stores = [
        {
          store: { constructor: { name: store.name } },
          get: getFn,
          set: setFn,
        } as unknown as Cache['stores'][number],
      ];

      const result = await firstValueFrom(info.info());

      expect(result).toEqual({
        stores: [
          {
            error: store.value instanceof Error ? store.value : undefined,
            ...expected,
            responseTimeInMilliseconds: expect.any(Number),
            store: store.name,
          },
        ],
      });
      expect(setFn).toHaveBeenCalledTimes(1);
      expect(setFn).toHaveBeenCalledWith('ping', 'PONG');
      expect(getFn).toHaveBeenCalledTimes(1);
      expect(getFn).toHaveBeenCalledWith('ping');
    });
  });
});
