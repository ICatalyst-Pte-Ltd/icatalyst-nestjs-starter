import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { forkJoin, map, Observable, of } from 'rxjs';
import { AppConfig } from '../../app.config.js';
import { env } from '../../common.js';
import { Info } from './entities/info.entity.js';
import { RegistryService } from './registry.service.js';

const BUILD_VERSION = 'APP_INFO_BUILD_VERSION';
const COMMIT_SHA = 'APP_INFO_GIT_COMMIT_SHA';
const COMMIT_TIME = 'APP_INFO_GIT_COMMIT_TIME';
const GIT_BRANCH = 'APP_INFO_GIT_BRANCH';
const PIPELINE_ID = 'APP_INFO_CI_PIPELINE_ID';
const PIPELINE_INTERNAL_ID = 'APP_INFO_CI_PIPELINE_INTERNAL_ID';
const PIPELINE_URL = 'APP_INFO_CI_PIPELINE_URL';

function defaultValue() {
  return 'NA';
}

function envOrDefault(name: string) {
  return env(name, defaultValue, true);
}

@Injectable()
export class InfoService {
  constructor(
    private readonly config: AppConfig,
    private readonly registry: RegistryService,
  ) {}

  getInfo(): Observable<Info> {
    const list = this.info();
    // if the list is empty, use a list that contains one empty object
    // because forkJoin require at least one element
    return forkJoin(list.length === 0 ? [of({})] : list).pipe(
      map((values) => {
        const extensions = values.reduce((previous, current) => {
          return { ...previous, ...current };
        }, {});
        const plain = {
          build: { version: envOrDefault(BUILD_VERSION) },
          ci: {
            pipelineId: envOrDefault(PIPELINE_ID),
            pipelineInternalId: envOrDefault(PIPELINE_INTERNAL_ID),
            pipelineUrl: envOrDefault(PIPELINE_URL),
          },
          // extensions may contain values that class-transformer cannot
          // reconstruct (e.g., errors with required constructor arguments)
          extensions: {},
          git: {
            branch: envOrDefault(GIT_BRANCH),
            commit: {
              sha: envOrDefault(COMMIT_SHA),
              time: envOrDefault(COMMIT_TIME),
            },
          },
          name: this.config.name,
          url: this.config.url,
        } satisfies Info;
        return Object.assign(plainToInstance(Info, plain), { extensions });
      }),
    );
  }

  /**
   * Retrieve the info for all registered {@link InfoExtension}s.
   *
   * @returns a list of info from all registered {@link InfoExtension}s.
   */
  private info(): ReadonlyArray<Observable<Record<string, unknown>>> {
    return this.registry.list().map((extension) => {
      return extension.info().pipe(
        map((info) => {
          return { [extension.name]: info };
        }),
      );
    });
  }
}
