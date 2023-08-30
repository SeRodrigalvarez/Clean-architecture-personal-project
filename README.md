# Clean Architecture Personal Project

## Description

This project started as [NoFakes Code Challenge](https://nofakes.notion.site/NoFakes-Backend-Challenge-c64335c58e934680996e45072e9b6894) with [Nest](https://github.com/nestjs/nest) using Hexagonal Architecture and SOLID Principles. I decided to use it as personal project to apply CQRS to the existing code base (still WIP).

One interesting detail to notice in this project: As typescript type exception catching is lacking (instanceof is needed to treat different types of exceptions), I decided to experiment with golang style error handling. You will find that try-catch is only used in infraestructure layer to treat persistence thrown exception while result objects are used in the rest of the code.

## Branches

Hexagonal Architecture: [00-hexagonal-architecture](/../../tree/00-hexagonal-architecture) or [main](/../../tree/main)

CQRS: [01-cqrs](/../../tree/01-cqrs) (WIP)

## Installation

```bash
$ npm install
```

```bash
# run once to install husky if you are going to commit something 
$ npm prepare
```

## Database

```bash
# start mongodb database 
$ docker compose up
```

The web interface can be accessed at `http://localhost:8081/`

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

## Test (WIP)

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```