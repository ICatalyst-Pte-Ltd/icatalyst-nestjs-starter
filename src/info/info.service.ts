import { Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config';
import { env } from '../common';
import { Build, CI, Commit, Git, Info } from './entities/info.entity';

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
  constructor(private readonly config: AppConfig) {}

  getInfo(): Info {
    const build = new Build(envOrDefault(BUILD_VERSION));
    const ci = new CI(
      envOrDefault(PIPELINE_ID),
      envOrDefault(PIPELINE_INTERNAL_ID),
      envOrDefault(PIPELINE_URL),
    );
    const commit = new Commit(
      envOrDefault(COMMIT_SHA),
      envOrDefault(COMMIT_TIME),
    );
    const git = new Git(envOrDefault(GIT_BRANCH), commit);
    const info = new Info(build, ci, git, this.config.name, this.config.url);
    return info;
  }
}
