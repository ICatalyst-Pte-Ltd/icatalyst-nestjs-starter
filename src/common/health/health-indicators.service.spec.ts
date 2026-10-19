import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { HealthIndicator } from './health-indicator.interface.js';
import { HealthIndicatorsService } from './health-indicators.service.js';

// change visibility of the protected methods to public
// so that they can be used in the tests
type TestIndicatorsService = HealthIndicatorsService & {
  clear(): void;
  get indicators(): Map<string, HealthIndicator>;
};

describe(HealthIndicatorsService.name, () => {
  let service: TestIndicatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthIndicatorsService.provider()],
    }).compile();

    service = module.get(HealthIndicatorsService);

    // since it is a singleton, clear the map
    service.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(HealthIndicatorsService.getInstance.name, () => {
    it('should always return the same instance', () => {
      const result = HealthIndicatorsService.getInstance();

      expect(result).toBe(service);
    });
  });

  describe(HealthIndicatorsService.provider.name, () => {
    it('should always return a factory provider', () => {
      const result = HealthIndicatorsService.provider();

      expect(result).toEqual({
        provide: HealthIndicatorsService,
        useFactory: HealthIndicatorsService.getInstance,
      });
    });
  });

  describe(HealthIndicatorsService.prototype.onApplicationShutdown.name, () => {
    it('should set the instance to undefined', () => {
      HealthIndicatorsService.getInstance();

      service.onApplicationShutdown();

      expect(
        (HealthIndicatorsService as unknown as { instance: unknown }).instance,
      ).toBeUndefined();
    });
  });

  describe(HealthIndicatorsService.prototype.register.name, () => {
    it('should add to the map', () => {
      const indicator = { name: randomUUID() } as HealthIndicator;

      service.register(indicator);

      expect(service.indicators.size).toBe(1);
      expect(service.indicators.get(indicator.name)).toBe(indicator);
    });

    it('should not add if the extension name is already used', () => {
      const indicator1 = { name: randomUUID() } as HealthIndicator;
      service.register(indicator1);
      const indicator2 = { name: indicator1.name } as HealthIndicator;

      service.register(indicator2);

      expect(service.indicators.size).toBe(1);
      expect(service.indicators.get(indicator2.name)).toBe(indicator1);
    });
  });

  describe(HealthIndicatorsService.prototype.list.name, () => {
    it('should return a list of registered indicators', () => {
      const names = [randomUUID(), randomUUID()];
      const indicators = names.map((name) => {
        return { name } as HealthIndicator;
      });
      indicators.forEach((indicator) => {
        service.register(indicator);
      });

      const result = service.list();

      expect(result).toEqual(indicators);
    });
  });
});
