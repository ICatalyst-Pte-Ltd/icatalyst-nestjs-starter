import type { Mock } from 'vitest';
import KeyvRedis, { RedisClientType } from '@keyv/redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { Keyv } from 'keyv';
import { SocketClosedUnexpectedlyError } from 'redis';
import { CacheHealthIndicator } from './cache.health.js';
import { CacheInfo } from './cache.info.js';
import { CacheModule } from './cache.module.js';

function connectionError(code: string): Error & { code: string } {
  return Object.assign(new Error(code), { code });
}

describe(CacheModule.name, () => {
  const env = { ...process.env };
  let module: TestingModule;
  let cache: Cache;

  async function compile(): Promise<void> {
    module = await Test.createTestingModule({
      imports: [CacheModule],
    }).compile();
    cache = module.get(CACHE_MANAGER);
  }

  function getStore(): KeyvRedis<unknown> {
    return (cache.stores[0] as unknown as Keyv).store as KeyvRedis<unknown>;
  }

  function getClient(): RedisClientType {
    return getStore()['_client'] as RedisClientType;
  }

  beforeEach(() => {
    process.env = { ...env, APP_URL: 'https://localhost:3000' };
    delete process.env.CACHE_TTL;
    vi.mocked(Logger.prototype.error).mockClear();
  });

  afterEach(async () => {
    // resets the health and info registries
    await module?.close();
  });

  afterAll(() => {
    process.env = { ...env };
  });

  describe('providers', () => {
    beforeEach(async () => {
      await compile();
    });

    it.each([{ Class: CacheHealthIndicator }, { Class: CacheInfo }])(
      '$Class.name should be defined',
      ({ Class }) => {
        expect(module.get(Class)).toBeDefined();
      },
    );

    it('should use a single Redis store', () => {
      expect(cache.stores).toHaveLength(1);
      expect(getStore()).toBeInstanceOf(KeyvRedis);
    });
  });

  describe('ttl', () => {
    it('should not set the ttl if CACHE_TTL is undefined', async () => {
      await compile();

      expect((cache.stores[0] as unknown as Keyv).ttl).toBeUndefined();
    });

    it('should set the ttl from CACHE_TTL', async () => {
      process.env.CACHE_TTL = '1000';

      await compile();

      expect((cache.stores[0] as unknown as Keyv).ttl).toBe(1000);
    });
  });

  describe('error listener', () => {
    let storeErrorListener: Mock<(error: unknown) => void>;

    beforeEach(async () => {
      await compile();
      storeErrorListener = vi.fn();
      getStore().on('error', storeErrorListener);
      // Keyv re-emits store errors and throws if it has no error listeners
      (cache.stores[0] as unknown as Keyv).on('error', vi.fn());
    });

    it.each([
      { description: 'ECONNREFUSED', error: connectionError('ECONNREFUSED') },
      { description: 'ECONNRESET', error: connectionError('ECONNRESET') },
      {
        description: 'an AggregateError of connection errors',
        error: new AggregateError([
          connectionError('ECONNREFUSED'),
          connectionError('ECONNRESET'),
        ]),
      },
      {
        description: 'a SocketClosedUnexpectedlyError',
        error: new SocketClosedUnexpectedlyError(),
      },
    ])('$#: should log instead of emitting $description', ({ error }) => {
      getClient().emit('error', error);

      expect(Logger.prototype.error).toHaveBeenCalledWith({
        method: `${getClient().constructor.name}.onError`,
        error,
      });
      expect(storeErrorListener).not.toHaveBeenCalled();
    });

    it.each([
      { description: 'a generic error', error: new Error('generic') },
      {
        description: 'an error with an unknown code',
        error: connectionError('ENOTFOUND'),
      },
      {
        description: 'an AggregateError with a non-connection error',
        error: new AggregateError([
          connectionError('ECONNREFUSED'),
          new Error('generic'),
        ]),
      },
    ])('$#: should emit $description on the store', ({ error }) => {
      getClient().emit('error', error);

      expect(storeErrorListener).toHaveBeenCalledWith(error);
      expect(Logger.prototype.error).not.toHaveBeenCalled();
    });

    it('should emit connection errors on the store if there is no reconnect strategy', () => {
      const client = getClient();
      const options = client.options as { socket: Record<string, unknown> };
      delete options.socket.reconnectStrategy;
      const error = connectionError('ECONNREFUSED');

      client.emit('error', error);

      expect(storeErrorListener).toHaveBeenCalledWith(error);
      expect(Logger.prototype.error).not.toHaveBeenCalled();
    });
  });
});
