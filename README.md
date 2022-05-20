# ICatalyst NestJS Starter

This project was initialized with the following command to scaffold a [Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

```shell
npx @nestjs/cli new --directory . <project-name>
```

Static code analysis is done by [ESLint](https://eslint.org/) and code formatting is done by [Prettier](https://prettier.io/).
These tools are used automatically to check the code using a [pre-commit](./.husky/pre-commit) [Git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) set up by [husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged).
In addition to the pre-commit hook, there is also a [prepare-commit-msg](./.husky/prepare-commit-msg) that will automatically append a [JIRA](https://www.atlassian.com/software/jira) issue number to the commit message.
The tools were installed using following command.

```shell
npx mrm@2 lint-staged
```

## Usage

The following sections describe the usage of this project.

### Installation

To set up and run this project locally, run the following command.
The command will install all the dependencies and set up the Git hooks.

```shell
npm install
```

### Running the app

To run this project locally, use one of the following commands.
There are some external dependencies that needs to be available before starting this project locally.
See the [External Dependencies](#external-dependencies) section for more information.

```shell
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

This project is also configured to run using Docker.
Docker Compose files are provided ([docker-compose.yml](./docker-compose.yml) and [docker-compose.local.yml](./docker-compose.local.yml)) that can be used to run this project using Docker.
A convenience script ([up](./scripts/up)) is provided to start this project as follows.

```shell
./scripts/up <service>
```

Furthermore, the Docker Compose is already configured to allow remote debugging.
In addition, a Visual Studio Code [launch.json](./.vscode/launch.json) is provided that can attach the debugger to the running container.

### Test

To test this project, use one of the following commands.
Note that the e2e (end-to-end) tests require the external dependencies to be available.

```shell
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

_Warning_: If the same database is reused for development and running the e2e tests, the contents of that database will be wiped.
As an alternative, a [test-e2e](./scripts/test-e2e) script is provided that can be used to run the e2e tests.
The script automatically start the external dependencies and configure a different database for the e2e tests.

### NestJS

Use the `@nestjs/cli` to create a resource.
The following example is the command used to generate the `captures` resource.

```shell
npx nest generate resource captures
```

The above command is roughly equivalent to the following series of commands.
The `dto` and `entities` have to be created manually.

```shell
npx nest generate module captures
npx nest generate controller captures
npx nest generate service captures
```

### Signature Verification

This project requires incoming requests be signed.
Requests should be signed with [HMAC-SHA256](https://en.wikipedia.org/wiki/HMAC).
The signature should be in the `x-signature` HTTP header.
A [Postman](https://www.postman.com/) collection with sample requests is provided in the [Capture Processor APIs.postman_collection.json](./docs/Capture%20Processor%20APIs.postman_collection.json) file.

## External Dependencies

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

When Prisma is initialized, a [prisma](./prisma) directory is created that contains the schema file ([schema.prisma](./prisma/schema.prisma)).
Based on the schema, Prisma will generate a client that can be used to interact with the database.
This client can be installed using the following command.

```shell
npm install @prisma/client
```

Further information on how to use the Prisma client is at https://www.prisma.io/docs/reference/api-reference/prisma-client-reference.

Further details on the specifications of the schema is at https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference and https://www.prisma.io/docs/concepts/components/prisma-schema.
And since the underlying database is PostgreSQL, specific details on how Prisma interacts with PostgresSQL is at https://www.prisma.io/docs/concepts/database-connectors/postgresql.

#### Schema Development Workflow

The Prisma CLI provides ways to aid in the development of models.
When there is an initial model, the following command creates a migration file, syncs the database, and updates the Prisma client.
Further details are located at https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate, https://www.prisma.io/docs/concepts/components/prisma-migrate, and https://www.prisma.io/docs/reference/api-reference/command-reference#prisma-migrate.

```shell
npx prisma migrate dev --name <name-of-migration>
```

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

### Elasticsearch

This project uses an [Elasticsearch](https://www.elastic.co/) cluster to provide better queries on captures.
There is a NestJS integration with Elasticsearch through the [@nestjs/elasticsearch](https://github.com/nestjs/elasticsearch) package.
Install the dependencies using the following command.

```shell
npm install --save @nestjs/elasticsearch @elastic/elasticsearch
```

#### Environment Variables

There are seven Elasticsearch environment variables.
They are used in the [docker-compose.yml](./docker-compose.yml), [docker-compose.local.yml](./docker-compose.local.yml), and [01.yml](./elasticsearch/config/01.yml) files.

```dotenv
ELASTICSEARCH_CLUSTER_NAME=elasticsearch-cluster
ELASTICSEARCH_JAVA_OPTS="-Xms256m -Xmx256m"
ELASTICSEARCH_PASSWORD=changeme
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_URL=http://localhost:${ELASTICSEARCH_PORT}
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_VERSION=7.15.0
```

### OpenAPIs

The first time a capture processor starts up, it will perform a self-registration with [OpenAPIs](https://gitlab.com/cognitive-edge/open-apis).

#### Environment Variable(s)

There are three required environment variables.
They are used in the [docker-compose.yml](./docker-compose.yml) file.

```dotenv
APP_REGISTRATION_TOKEN=token
APP_REGISTRATION_URL=http://localhost:9000
APP_URL=http://localhost:3000
```

## AWS Deployment

This project can be deployed to AWS using the Docker Compose [ECS](https://docs.docker.com/cloud/ecs-integration/) integration.
Before being able to deploy, a new Docker context needs to be created and two repositories in AWS [ECR](https://aws.amazon.com/ecr/) to store the images.
The name of the repositories are `cognitive-edge/capture-processor` and `cognitive-edge/elasticsearch`, which correspond to the `image` keys in the [docker-compose.yml](./docker-compose.yml) file.
Create a new Docker ECS context using the following command and follow the interactive instructions.

```shell
docker context create ecs <name-of-ecs-context>
```

Once the Docker context is created, the images need to be built and pushed to two ECR repositories.
One repository for the application itself and the other repository for the Elasticsearch image.
Build the Docker images using the following command with the [docker-compose.build.yml](./docker-compose.build.yml) file.
For convenience, a [build](./scripts/build) script is provided.

```shell
docker compose --file docker-compose.yml --file docker-compose.build.yml build
```

Then login to AWS ECR using the following command.

```shell
aws ecr get-login-password | docker login --username AWS --password-stdin 1234567890.dkr.ecr.aws-region.amazonaws.com
```

And to push the images to the two ECR repositories, use the following commands.

```shell
docker push --all-tags 1234567890.dkr.ecr.aws-region.amazonaws.com/cognitive-edge/capture-processor
docker push --all-tags 1234567890.dkr.ecr.aws-region.amazonaws.com/cognitive-edge/elasticsearch
```

Once the images are pushed, deploy to AWS using the following command.
It will create a new or update an existing CloudFormation stack using the current directory name as the stack name.

```shell
docker --context <name-of-ecs-context> compose --file docker-compose.yml up
```

To use a different stack name use the `--project-name` option as follows.

```shell
docker --context <name-of-ecs-context> compose --file docker-compose.yml --project-name <name-of-project> up
```

To remove the CloudFormation stack and its resources, replace the command `up` with `down` as follows.

```shell
docker --context <name-of-ecs-context> compose --file docker-compose.yml down
```

#### Environment Variable(s)

There are two environment variables.
They are used in the [docker-compose.yml](./docker-compose.yml) and [docker-compose.build.yml](./docker-compose.build.yml) files.

```dotenv
# Docker
DOCKER_REGISTRY=1234567890.dkr.ecr.aws-region.amazonaws.com

# Elasticsearch
ELASTICSEARCH_VERSION=7.15.0
```

## Environment Variable(s)

The following is a combined list of environment variables and example values.

```dotenv
# APP
APP_PORT=3000
APP_REGISTRATION_TOKEN=token
APP_REGISTRATION_URL=http://localhost:9000
APP_URL=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_NAME=nestjs
DATABASE_PASSWORD=password
DATABASE_PORT=5432
DATABASE_USER=nestjs

# Docker
DOCKER_REGISTRY=1234567890.dkr.ecr.aws-region.amazonaws.com

# Elasticsearch
ELASTICSEARCH_CLUSTER_NAME=elasticsearch-cluster
ELASTICSEARCH_JAVA_OPTS="-Xms256m -Xmx256m"
ELASTICSEARCH_PASSWORD=changeme
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_URL=http://localhost:${ELASTICSEARCH_PORT}
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_VERSION=7.15.0

# Prisma
DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?schema=public
```
