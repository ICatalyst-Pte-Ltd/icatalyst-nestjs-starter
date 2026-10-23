import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { HealthIndicator } from './health-indicator.interface.js';

/**
 * The {@link HealthIndicatorsService} manages a list of {@link HealthIndicator}s.
 */
@Injectable()
export class HealthIndicatorsService implements OnApplicationShutdown {
  private static instance?: HealthIndicatorsService;

  readonly #logger = new Logger(HealthIndicatorsService.name);
  readonly #indicators = new Map<string, HealthIndicator>();

  /**
   * Returns an existing instance of the {@link HealthIndicatorsService}, if it exists.
   * Otherwise, instantiates a new instance and return that instance for subsequent calls to {@link getInstance}.
   *
   * @returns An instance of the {@link HealthIndicatorsService}.
   */
  static getInstance(this: void): HealthIndicatorsService {
    if (HealthIndicatorsService.instance === undefined) {
      HealthIndicatorsService.instance = new HealthIndicatorsService();
    }
    return HealthIndicatorsService.instance;
  }

  /**
   * A convenience method to create a {@link Provider}.
   *
   * @returns A {@link Provider} for the {@link HealthIndicatorsService}.
   */
  static provider(): Provider {
    return {
      provide: HealthIndicatorsService,
      useFactory: HealthIndicatorsService.getInstance,
    };
  }

  /**
   * A private constructor to ensure that only one instance is used.
   * Use the {@link getInstance} method to retrieve an instance.
   */
  private constructor() {}

  onApplicationShutdown(signal?: string): void {
    this.#logger.debug({ method: this.onApplicationShutdown.name, signal });
    HealthIndicatorsService.instance = undefined;
  }

  /**
   * Register the given {@link HealthIndicator} to the list of {@link HealthIndicator}s.
   *
   * @param indicator The {@link HealthIndicator} to register.
   */
  register(indicator: HealthIndicator): void {
    if (this.#indicators.get(indicator.name) == undefined) {
      this.#indicators.set(indicator.name, indicator);
    } else {
      // an indicator is already registered with the same name
      this.#logger.error({
        method: this.register.name,
        name: indicator.name,
        message: 'Indicator name already registered!',
      });
    }
  }

  /**
   * Retrieve a list of all registered {@link HealthIndicator}s.
   */
  list(): ReadonlyArray<HealthIndicator> {
    return Array.from(this.#indicators.values());
  }

  /**
   * Clears the {@link HealthIndicator}s map.
   *
   * This is meant to be used as an internal API, not as a public API
   */
  protected clear(): void {
    this.#indicators.clear();
  }

  /**
   * Returns the {@link HealthIndicator}s map.
   *
   * This is meant to be used as an internal API, not as a public API
   *
   * @returns the {@link HealthIndicator}s map.
   */
  protected get indicators(): Map<string, HealthIndicator> {
    return this.#indicators;
  }
}
