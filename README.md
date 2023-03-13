# NoFakes-Code-Challenge

## Description

[NoFakes Code Challenge](https://nofakes.notion.site/NoFakes-Backend-Challenge-c64335c58e934680996e45072e9b6894) with [Nest](https://github.com/nestjs/nest) using Hexagonal Architecture.

## Installation

```bash
$ npm install
```

```bash
# run once to install husky if you are going to commit something 
$ npm prepare
```

```bash
# start mongodb database 
$ docker compose up
```

## Running the app

MongoDB environment variables must be set in the `.env`. Use `.env.example` as template.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

`No-Fakes.postman_collection.json` contains all the REST requests.

## Missing tasks
- Add unit, integration and e2e tests
- Use Criteria pattern in get repository methods to avoid method explosion
- Create update and delete endpoints
- Use a logger
- Improve businesses duplication control (name check is not enough)
- Use problem details RFC in REST responses
- Use an address validation API to validate addresses

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```