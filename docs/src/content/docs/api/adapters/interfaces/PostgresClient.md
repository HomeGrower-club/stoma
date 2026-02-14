---
editUrl: false
next: false
prev: false
title: "PostgresClient"
---

Defined in: [src/adapters/postgres.ts:26](https://github.com/HomeGrower-club/stoma/blob/162619492d6688db22e8617fe051bccc1c9cffc5/src/adapters/postgres.ts#L26)

Minimal PostgreSQL client interface - satisfied by `pg`, `postgres.js`, and most
Postgres libraries. Only a single `query` method is required.

## Methods

### query()

> **query**(`text`, `params?`): `Promise`\<\{ `rows`: `Record`\<`string`, `unknown`\>[]; \}\>

Defined in: [src/adapters/postgres.ts:27](https://github.com/HomeGrower-club/stoma/blob/162619492d6688db22e8617fe051bccc1c9cffc5/src/adapters/postgres.ts#L27)

#### Parameters

##### text

`string`

##### params?

`unknown`[]

#### Returns

`Promise`\<\{ `rows`: `Record`\<`string`, `unknown`\>[]; \}\>
