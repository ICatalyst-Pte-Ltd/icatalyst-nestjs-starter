import { Observable } from 'rxjs';
import { InfoExtension } from './info-extension.interface.js';
import { RegistryService } from './registry.service.js';

/**
 * Abstract class to implement the {@link InfoExtension} interface.
 */
export abstract class AbstractInfo<T = unknown> implements InfoExtension<T> {
  /**
   * Constructor to register the {@link InfoExtension} in the {@link RegistryService}.
   *
   * @param name The name of the {@link InfoExtension}.
   * @param registry The {@link RegistryService} to add the {@link InfoExtension}.
   */
  constructor(
    public readonly name: string,
    registry: RegistryService,
  ) {
    registry.register(this);
  }

  abstract info(): Observable<T>;
}
