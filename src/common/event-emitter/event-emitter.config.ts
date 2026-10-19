import { Injectable } from '@nestjs/common';
import Joi from 'joi';
import { validateEnv } from '../validations/index.js';

interface Env {
  EVENT_EMITTER_MAX_LISTENERS: number;
}

const schema = Joi.object<Env>({
  EVENT_EMITTER_MAX_LISTENERS: Joi.number().default(10).min(1).max(50),
});

@Injectable()
export class EventEmitterConfig {
  public readonly maxListeners: number;

  constructor() {
    const { EVENT_EMITTER_MAX_LISTENERS } = validateEnv(schema);
    this.maxListeners = EVENT_EMITTER_MAX_LISTENERS;
  }
}
