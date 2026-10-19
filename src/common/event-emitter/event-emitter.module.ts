import { Global, Logger, Module } from '@nestjs/common';
import {
  EventEmitter2,
  EventEmitterModule as NestEventEmitterModule,
} from '@nestjs/event-emitter';
import { EventEmitterConfig } from './event-emitter.config.js';
import { EventEmitterService } from './event-emitter.service.js';

@Global()
@Module({
  imports: [
    NestEventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      newListener: false,
      removeListener: false,
      wildcard: true,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: true,
    }),
  ],
  providers: [
    EventEmitterConfig,
    {
      provide: EventEmitterService,
      useFactory: (config: EventEmitterConfig, emitter: EventEmitter2) => {
        const logger = new Logger('EventEmitterModule');
        // Update the emitter to match the config specified
        logger.debug(`Setting max event listeners to ${config.maxListeners} `);
        emitter.setMaxListeners(config.maxListeners);
        logger.log(`Initialising Nest Event Emitter Module`);
        return new EventEmitterService(logger, emitter);
      },
      inject: [EventEmitterConfig, EventEmitter2],
    },
  ],
  exports: [NestEventEmitterModule, EventEmitterService],
})
export class EventEmitterModule {}
