import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { InfoExtension } from './info-extension.interface.js';
import { RegistryService } from './registry.service.js';
import { mockInfoExtension } from './registry.service.utils.spec.js';

// change visibility of the protected methods to public
// so that they can be used in the tests
type TestRegistryService = RegistryService & {
  clear(): void;
  get extensions(): Map<string, InfoExtension>;
};

describe(RegistryService.name, () => {
  let service: TestRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RegistryService,
          useFactory: RegistryService.getInstance,
        },
      ],
    }).compile();

    service = module.get(RegistryService);

    // since it is a singleton, clear the map
    service.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(RegistryService.getInstance.name, () => {
    it('should always return the same instance', () => {
      const result = RegistryService.getInstance();

      expect(result).toBe(service);
    });
  });

  describe(RegistryService.prototype.onApplicationShutdown.name, () => {
    it('should set the instance to undefined', () => {
      RegistryService.getInstance();

      service.onApplicationShutdown();

      expect(
        (RegistryService as unknown as { instance: unknown }).instance,
      ).toBeUndefined();
    });
  });

  describe(RegistryService.prototype.register.name, () => {
    it('should add to the map', () => {
      const extension = mockInfoExtension({});

      service.register(extension);

      expect(service.extensions.size).toBe(1);
      expect(service.extensions.get(extension.name)).toBe(extension);
    });

    it('should not add if the extension name is already used', () => {
      const extension1 = mockInfoExtension({});
      service.register(extension1);
      const extension2 = mockInfoExtension({ name: extension1.name });

      service.register(extension2);

      expect(service.extensions.size).toBe(1);
      expect(service.extensions.get(extension2.name)).toBe(extension1);
    });
  });

  describe(RegistryService.prototype.list.name, () => {
    it('should return a list of registered extensions', () => {
      const values = [randomUUID(), randomUUID()];
      const extensions = values.map((value) => {
        return mockInfoExtension({ name: value });
      });
      extensions.forEach((extension) => {
        service.register(extension);
      });

      const result = service.list();

      expect(result).toEqual(extensions);
    });
  });
});
