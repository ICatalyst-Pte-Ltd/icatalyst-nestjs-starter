import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
} from 'rxjs';
import { AbstractInfo, RegistryService } from '../info/index.js';
import { NAME } from './constants.js';
import { CacheHealth, StoreHealth } from './types.js';

export class CacheInfo extends AbstractInfo {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    registry: RegistryService,
  ) {
    super(NAME, registry);
  }

  info(): Observable<CacheHealth> {
    const observables = this.cache.stores.map((store) => {
      const start = performance.now();
      return this.ping(store).pipe(
        map((ping) => {
          const end = performance.now();
          return {
            end,
            error: ping === 'PONG' ? undefined : `Invalid ping value: ${ping}`,
          };
        }),
        catchError((error) => {
          const end = performance.now();
          return of({ end, error });
        }),
        map(({ end, error }) => {
          return {
            error,
            responseTimeInMilliseconds: end - start,
            status: error ? 'down' : 'up',
            store: store.store.constructor.name,
          } satisfies StoreHealth;
        }),
      );
    });
    return forkJoin(observables).pipe(
      map((stores) => {
        return { stores };
      }),
    );
  }

  private ping(store: Cache['stores'][number]) {
    // KeyvRedis does not have a ping method, so simulate a ping by setting
    // and then getting the ping
    return from(store.set('ping', 'PONG')).pipe(
      mergeMap(() => {
        return from(store.get('ping'));
      }),
    );
  }
}
