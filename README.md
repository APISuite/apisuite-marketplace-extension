# API Suite - Marketplace Extension

[![circleci](https://circleci.com/gh/APISuite/apisuite-marketplace-extension.svg?style=shield)](https://app.circleci.com/pipelines/github/APISuite/apisuite-marketplace-extension)

This repository contains an extension to APISuite Core that provides a backend for the marketplace feature.

## How it works

There are 2 components in this extension that should be executed separately (for isolation/scaling purposes)

#### Web Server

Starts with `npm run server`.

Serves a REST API, documented in `openapi.yml`.

#### Message Consumer

Starts with `npm run consumer`.

Consumes application related events from APISuite's message broker.

Marketplace interactions need some information about the applications in APISuite.
Therefore, this component keeps the database in sync with the core when it comes to some applications' data.


## Installing

Docker images are available in our [DockerHub](https://hub.docker.com/r/cloudokihub/apisuite-marketplace-extension).

Every new image is tagged with:
- latest (meaning this tag always points to the most recent released version)
- semantic version from `package.json`

Depending on your goals, you could use a fixed version like `1.0.0` or
`latest` to simply get the most recent version every time you pull the image.

## Monitoring

Thi API server provides two monitoring endpoints:
- `GET /health` for general health checking (of the server and major dependencies such as database connection)
- `GET /metrics` provides Prometheus ready metrics concerning requests time and status codes

### Configuration

Configuration is done through environment variables.
All variables are declared and documented in `src/config/schema.js`.


## Development

- Commits should follow [conventional commits](https://www.conventionalcommits.org) spec
- `package.json` contains the necessary scripts and dependencies to run the components of this project
- Typescript is configured to produce source maps, which makes debugger usage possible
- API driven development is preferred, so that we can keep the API solid and consistent
- Database migrations should be planed/created in a gradual way to avoid breaking changes
  (example: renaming a column can be done in 2 steps: create new column; change code to start using new column; delete old column when code no longer references it)

## Database migrations

Knex.js CLI is used for migration management: http://knexjs.org/#Migrations

### How to use

Generate a migration: `npx knex migrate:make --migrations-directory ./migrations create-table`
