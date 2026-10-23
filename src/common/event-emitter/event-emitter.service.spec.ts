import type { Mock } from 'vitest';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitterService } from './event-emitter.service.js';

describe(EventEmitterService.name, () => {
  const name = 'an.event.with.namespaces';
  const payload = { test: 1 };
  let service: EventEmitterService;
  let emit: Mock;
  let emitAsync: Mock;
  let emitter: EventEmitter2;
  let logger: Logger;
  let warn: Mock;

  beforeEach(() => {
    emit = vi.fn();
    emitAsync = vi.fn();
    warn = vi.fn();
    emitter = { emit, emitAsync } as unknown as EventEmitter2;
    logger = { debug: vi.fn(), warn } as unknown as Logger;
    service = new EventEmitterService(logger, emitter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use a default logger if none is provided', () => {
    const service = new EventEmitterService(
      undefined as unknown as Logger,
      emitter,
    );

    expect(service['logger']).toBeInstanceOf(Logger);
  });

  describe(EventEmitterService.prototype.emit.name, () => {
    it('should call emit on the EventEmitter with the appropriate values', () => {
      emit.mockReturnValue(true);

      const result = service.emit(name, payload);

      expect(result).toBe(true);
      expect(emit).toHaveBeenCalledWith(name, payload);
      expect(warn).not.toHaveBeenCalled();
    });

    it('should warn if there are no registered handlers', () => {
      emit.mockReturnValue(false);

      const result = service.emit(name, payload);

      expect(result).toBe(false);
      expect(warn).toHaveBeenCalledWith(`[${name}] has no registered handlers`);
    });
  });

  describe(EventEmitterService.prototype.emitAsync.name, () => {
    it('should call emitAsync on the EventEmitter with the appropriate values', async () => {
      emitAsync.mockResolvedValue([true]);

      const result = await service.emitAsync(name, payload);

      expect(result).toEqual([true]);
      expect(emitAsync).toHaveBeenCalledWith(name, payload);
    });
  });
});
