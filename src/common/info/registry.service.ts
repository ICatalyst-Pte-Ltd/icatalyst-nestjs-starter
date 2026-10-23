import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InfoExtension } from './info-extension.interface.js';

/**
 * The {@link RegistryService} manages a list of {@link InfoExtension}s.
 */
@Injectable()
export class RegistryService implements OnApplicationShutdown {
  private static instance?: RegistryService;

  readonly #logger = new Logger(RegistryService.name);
  readonly #extensions = new Map<string, InfoExtension>();

  /**
   * Returns an existing instance of the {@link RegistryService}, if it exists.
   * Otherwise, instantiates a new instance and return that instance for subsequent calls to {@link getInstance}.
   *
   * @returns an instance of the {@link RegistryService}.
   */
  static getInstance(this: void): RegistryService {
    if (RegistryService.instance === undefined) {
      RegistryService.instance = new RegistryService();
    }
    return RegistryService.instance;
  }

  /**
   * A private constructor to ensure that only one instance is used.
   * Use the {@link getInstance} method to retrieve an instance.
   */
  private constructor() {}

  onApplicationShutdown(signal?: string): void {
    this.#logger.debug({ method: this.onApplicationShutdown.name, signal });
    RegistryService.instance = undefined;
  }

  /**
   * Register the given {@link InfoExtension} to the list of {@link InfoExtension}s.
   *
   * @param extension the {@link InfoExtension} to register.
   */
  register(extension: InfoExtension): void {
    if (this.#extensions.get(extension.name) == undefined) {
      this.#extensions.set(extension.name, extension);
    } else {
      // an extension is already registered with the same name
      this.#logger.error({
        method: this.register.name,
        name: extension.name,
        message: 'Extension name already registered!',
      });
    }
  }

  /**
   * Retrieve a list of all registered {@link InfoExtension}s.
   */
  list(): ReadonlyArray<InfoExtension> {
    return Array.from(this.#extensions.values());
  }

  /**
   * Clears the extensions map.
   *
   * This is meant to be used as an internal API, not as a public API
   */
  protected clear(): void {
    this.#extensions.clear();
  }

  /**
   * Returns the extensions map.
   *
   * This is meant to be used as an internal API, not as a public API
   *
   * @returns the processors map.
   */
  protected get extensions(): Map<string, InfoExtension> {
    return this.#extensions;
  }
}
