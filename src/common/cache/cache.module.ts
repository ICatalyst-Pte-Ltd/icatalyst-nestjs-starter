import KeyvRedis, { RedisClientOptions, RedisClientType } from '@keyv/redis';
import {
  CacheModuleAsyncOptions,
  CacheOptions,
  CacheModule as NestJSCacheModule,
} from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { SocketClosedUnexpectedlyError } from 'redis';
import { HealthModule } from '../health/index.js';
import { InfoModule } from '../info/index.js';
import { RedisConfig, RedisModule } from '../redis/index.js';
import { CacheConfig } from './cache.config.js';
import { CacheHealthIndicator } from './cache.health.js';
import { CacheInfo } from './cache.info.js';
import { reconnectStrategy } from './reconnect-strategy.js';

function isError(error: unknown): error is Error & { code: string } {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string' &&
    ['ECONNREFUSED', 'ECONNRESET'].includes(error.code)
  );
}

function isAggregateError(error: unknown): error is AggregateError {
  return error instanceof AggregateError && error.errors.every(isError);
}

// TODO: figure out why the reconnect strategy is not working if the default error listener
//  that calls the emits is not removed.
function hack(store: KeyvRedis<unknown>, logger: Logger) {
  const client = store['_client'] as RedisClientType;
  const errorListeners = client.listeners('error');
  logger.debug({ function: hack.name, errorListeners });
  client.removeAllListeners('error');
  client.on('error', (error: unknown) => {
    // if the error is a SocketClosedUnexpectedlyError, a connection error (ECONNREFUSED or ECONNRESET), or
    // an AggregateError where every error is a connection error (ECONNREFUSED or ECONNRESET),
    // and there is a reconnect strategy,
    // then do not emit the error but instead log it
    if (
      (isAggregateError(error) ||
        error instanceof SocketClosedUnexpectedlyError ||
        isError(error)) &&
      client.options?.socket?.reconnectStrategy
    ) {
      logger.error({
        method: `${client.constructor.name}.onError`,
        error,
      });
    } else {
      // keep the original listener's intent of emitting the error
      // for errors that are not related to connection
      store.emit('error', error);
    }
  });
  // connect now instead of waiting for first use to connect
  // TODO: find out how to disconnect when unit testing, otherwise
  //  it prevents the tests from completing
  // client.connect();
}

const options: CacheModuleAsyncOptions = {
  // TODO: figure out why an existing instance cannot be used
  //  must include the CacheConfig as an extra provider but for some reason
  //  it cannot use an existing instance
  extraProviders: [CacheConfig],
  imports: [RedisModule],
  inject: [CacheConfig, RedisConfig],
  useFactory(cacheConfig: CacheConfig, redisConfig: RedisConfig) {
    const logger = new Logger(CacheModule.name);
    logger.debug({ function: 'useFactory', cacheConfig, redisConfig });
    const store = new KeyvRedis({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        reconnectStrategy: reconnectStrategy(logger),
      },
    } satisfies RedisClientOptions);
    hack(store, logger);
    const options: CacheOptions = {
      stores: [store],
    };
    // cannot set the ttl property inline because if the value is undefined,
    // it would mean to disable TTL
    // instead the ttl property is only set if the value is defined
    if (cacheConfig.ttl != undefined) {
      options.ttl = cacheConfig.ttl;
    }
    return options;
  },
};

@Module({
  exports: [NestJSCacheModule],
  imports: [HealthModule, InfoModule, NestJSCacheModule.registerAsync(options)],
  // TODO: find out why an existing instance cannot be used
  //  declaring the CacheConfig as a provider here causes the constructor to be called
  //  twice; once here and once for the extraProviders
  //  for some reason, it cannot reuse an existing instance
  providers: [
    // CacheConfig
    CacheHealthIndicator,
    CacheInfo,
  ],
})
export class CacheModule {}
