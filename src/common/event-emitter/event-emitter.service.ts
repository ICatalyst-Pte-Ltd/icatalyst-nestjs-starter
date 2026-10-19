import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class EventEmitterService {
  constructor(
    private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.logger = logger || new Logger(this.constructor.name);
  }

  emit<PAYLOAD = unknown>(eventName: string, payload: PAYLOAD): boolean {
    this.logger.debug(`Firing Event: [${eventName}]`);
    const result = this.eventEmitter.emit(eventName, payload);
    if (!result) {
      this.logger.warn(`[${eventName}] has no registered handlers`);
    }
    return result;
  }

  emitAsync<PAYLOAD = unknown>(
    eventName: string,
    payload: PAYLOAD,
  ): Promise<Array<unknown>> {
    this.logger.debug(`Firing Async Event: [${eventName}]`);
    return this.eventEmitter.emitAsync(eventName, payload);
  }
}
