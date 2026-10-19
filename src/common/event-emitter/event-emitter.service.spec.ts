import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventEmitterService } from './event-emitter.service.js';

describe(EventEmitterService.name, () => {
  const name = 'an.event.with.namespaces';
  const payload = { test: 1 };
  let service: EventEmitterService;
  let emitter: EventEmitter2;
  let logger: Logger;

  beforeEach(() => {
    emitter = {
      emit: vi.fn(),
      emitAsync: vi.fn(),
    } as unknown as EventEmitter2;
    logger = { debug: vi.fn(), warn: vi.fn() } as unknown as Logger;
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
      vi.mocked(emitter.emit).mockReturnValue(true);

      const result = service.emit(name, payload);

      expect(result).toBe(true);
      expect(emitter.emit).toHaveBeenCalledWith(name, payload);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should warn if there are no registered handlers', () => {
      vi.mocked(emitter.emit).mockReturnValue(false);

      const result = service.emit(name, payload);

      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(
        `[${name}] has no registered handlers`,
      );
    });
  });

  describe(EventEmitterService.prototype.emitAsync.name, () => {
    it('should call emitAsync on the EventEmitter with the appropriate values', async () => {
      vi.mocked(emitter.emitAsync).mockResolvedValue([true]);

      const result = await service.emitAsync(name, payload);

      expect(result).toEqual([true]);
      expect(emitter.emitAsync).toHaveBeenCalledWith(name, payload);
    });
  });
});
