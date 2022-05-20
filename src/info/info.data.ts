export class Info {
  constructor(
    public readonly build: Build,
    public readonly ci: CI,
    public readonly git: Git,
    public readonly name: string,
  ) {}
}

export class Build {
  constructor(public readonly version: string) {}
}

export class CI {
  constructor(
    public readonly pipelineId: string,
    public readonly pipelineInternalId: string,
    public readonly pipelineUrl: string,
  ) {}
}

export class Git {
  constructor(public readonly branch: string, public readonly commit: Commit) {}
}

export class Commit {
  constructor(public readonly sha: string, public readonly time: string) {}
}
