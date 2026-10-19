import { Observable } from 'rxjs';

/**
 * An {@link InfoExtension}.
 */
export interface InfoExtension<T = unknown> {
  /**
   * The name of the {@link InfoExtension}.
   */
  readonly name: string;

  /**
   * Retrieve the info from the {@link InfoExtension}.
   *
   * @returns the info.
   */
  info(): Observable<T>;
}
