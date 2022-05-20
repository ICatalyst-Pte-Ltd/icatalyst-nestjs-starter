/**
 * Information about the application
 */
export class Info {
  /**
   * The build information
   */
  readonly build: Build;

  /**
   * The CI information
   */
  readonly ci: CI;

  /**
   * The Git information
   */
  readonly git: Git;

  /**
   * The name of the application
   *
   * @example 'application name'
   */
  readonly name: string;

  /**
   * The URL of the application
   *
   * @example https://example.com
   */
  readonly url: string;

  constructor(build: Build, ci: CI, git: Git, name: string, url: string) {
    this.build = build;
    this.ci = ci;
    this.git = git;
    this.name = name;
    this.url = url;
  }
}

/**
 * Information about the build of an application
 */
export class Build {
  /**
   * The version of an application
   *
   * @example 1.2.3
   */
  readonly version: string;

  constructor(version: string) {
    this.version = version;
  }
}

/**
 * Information about the CI that deployed an application
 */
export class CI {
  /**
   * The ID of a CI pipeline
   *
   * @example 1234567890
   */
  readonly pipelineId: string;

  /**
   * The internal ID of a CI pipeline
   *
   * @example 123
   */
  readonly pipelineInternalId: string;

  /**
   * The URL of a CI pipeline
   *
   * @example https://example.com/pipeline/1234567890
   */
  readonly pipelineUrl: string;

  constructor(
    pipelineId: string,
    pipelineInternalId: string,
    pipelineUrl: string,
  ) {
    this.pipelineId = pipelineId;
    this.pipelineInternalId = pipelineInternalId;
    this.pipelineUrl = pipelineUrl;
  }
}

/**
 * Information about the Git repository
 */
export class Git {
  /**
   * The Git branch on which an application is deployed
   *
   * @example main
   */
  readonly branch: string;

  /**
   * The commit information on which an application is deployed
   */
  readonly commit: Commit;

  constructor(branch: string, commit: Commit) {
    this.branch = branch;
    this.commit = commit;
  }
}

/**
 * Information about a commit
 */
export class Commit {
  /**
   * The SHA of a commit
   *
   * @example 1234567890abcdef123456789abcdef123456789
   */
  readonly sha: string;

  /**
   * The time a commit was created
   *
   * @example 2000-01-23T00:00:00+00:00
   */
  readonly time: string;

  constructor(sha: string, time: string) {
    this.sha = sha;
    this.time = time;
  }
}
