# ICatalyst NestJS Starter

[![semantic-release: conventionalcommits](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This project was initialized with the following command to scaffold a [Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

```shell
npx @nestjs/cli new --directory . <project-name>
```

Static code analysis is done by [ESLint](https://eslint.org/) and code formatting is done by [Prettier](https://prettier.io/).
These tools are used automatically to check the code using [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) set up by [husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged).
The tools were installed using following command.

```shell
npx mrm@2 lint-staged
```

Three Git hooks are provided: [commit-msg](./.husky/commit-msg), [pre-commit](./.husky/pre-commit), and [prepare-commit-msg](./.husky/prepare-commit-msg).
The [commit-msg](./.husky/commit-msg) hook uses the [commitlint](https://github.com/conventional-changelog/commitlint) tool to lint commit messages according to the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
The configuration of the tool is located in the [.commitlintrc.yml](./.commitlintrc.yml) configuration file.
The [pre-commit](./.husky/pre-commit) hook automatically formats files according to the configuration specified in the [.lintstagedrc.yml](./.lintstagedrc.yml) file.
The [prepare-commit-msg](./.husky/prepare-commit-msg) hook automatically appends a [JIRA](https://www.atlassian.com/software/jira) issue number to the commit message if the branch name that contains the `[A-Z]\+-\d\+` regular expression.

## Usage

The following sections describe the usage of this project.

### Installation

To set up and run this project locally, run the following command.
The command will install all the dependencies and set up the Git hooks.

```shell
npm install
```

### Running the app

There are some external dependencies that need to be available before starting this project locally.
See the [External Dependencies](#external-dependencies) section for more information.
To run this project locally, use one of the following commands.

```shell
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

This project is also configured to run using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).
Docker Compose files are provided ([docker-compose.yml](./docker-compose.yml) and [docker-compose.local.yml](./docker-compose.local.yml)) that can be used to run this project using Docker.
A convenience script ([up](./scripts/up)) is provided to start this project as follows.

```shell
./scripts/up <service>
```

Furthermore, the Docker Compose is already configured to allow remote debugging.
In addition, a Visual Studio Code [launch.json](./.vscode/launch.json) is provided that can attach a debugger to the running container.

### Test

To test this project, use one of the following commands.
Note that the e2e (end-to-end) tests require the external dependencies to be available.

```shell
# unit tests
npm run test

# e2e tests
npm run test:e2e

# unit test coverage
npm run test:cov
```

_Warning_: If the same database is used for development and running the e2e tests, the contents of that database will be wiped.
As an alternative, a [test-e2e](./scripts/test-e2e) script is provided that can be used to run the e2e tests on a different database.
The script automatically starts the external dependencies and configure a different database for the e2e tests.

### NestJS

Since this project uses the Nest framework, the `@nestjs/cli` tool can be used in the development and maintainence of this project.
See https://docs.nestjs.com/cli/overview for more details.

## External Dependencies

The following sections describe the dependencies of this project.

### Database

This project uses a [PostgreSQL](https://www.postgresql.org/) database.
Connection to the database is through the [Prisma](https://www.prisma.io/) ORM library.
Prisma provides a CLI that can be used to initialize or add Prisma.
Install the CLI using the following commands.

```shell
# adds the Prisma CLI as a dev dependency
npm install --save-dev prisma
# initialize/add Prisma to the project
npx prisma init
```

Further details on getting started with Prisma can be read at https://www.prisma.io/docs/getting-started.
Further details on NestJS integration with Prisma can be read at https://docs.nestjs.com/recipes/prisma.

When Prisma is initialized, a [prisma](./prisma) directory is created that contains the [schema.prisma](./prisma/schema.prisma) schema file and a directory for [migrations](./prisma/migrations/).
Based on the schema, Prisma will generate a client that can be used to interact with the database.
This client can be installed using the following command.

```shell
npm install @prisma/client
```

Further information on how to use the Prisma client is at https://www.prisma.io/docs/reference/api-reference/prisma-client-reference.

See https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference and https://www.prisma.io/docs/concepts/components/prisma-schema for further details on the specifications of the schema.
And since the underlying database is PostgreSQL, specific details on how Prisma interacts with PostgresSQL is at https://www.prisma.io/docs/concepts/database-connectors/postgresql.

#### Schema Development Workflow

The Prisma CLI provides ways to aid in the development of models.
When there is an initial model, the following command creates a migration file, syncs the database, and updates the Prisma client.

```shell
npx prisma migrate dev --name <name-of-migration>
```

See https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate, https://www.prisma.io/docs/concepts/components/prisma-migrate, and https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate for further details.

Deploying migrations to production is as simple as the following command.

```shell
npx prisma migrate deploy
```

When developing Prisma models for PostgreSQL, further details on the type mappings is at https://www.prisma.io/docs/concepts/database-connectors/postgresql#type-mapping-between-postgresql-to-prisma-schema.

#### Environment Variable(s)

There are five database environment variables and one Prisma environment variable.
The database environment variables are used in the [docker-compose.yml](./docker-compose.yml) file for the `database` service.
And the Prisma environment variable is used in the Prisma schema file in the `env()`.

```dotenv
# Database
DATABASE_HOST=localhost
DATABASE_NAME=nestjs
DATABASE_PASSWORD=password
DATABASE_PORT=5432
DATABASE_USER=nestjs

# Prisma
DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public
```

## Environment Variable(s)

The following is a combined list of environment variables and example values.

```dotenv
# APP
APP_NAME=app-name
APP_PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_NAME=nestjs
DATABASE_PASSWORD=password
DATABASE_PORT=5432
DATABASE_USER=nestjs

# Prisma
DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public
```
