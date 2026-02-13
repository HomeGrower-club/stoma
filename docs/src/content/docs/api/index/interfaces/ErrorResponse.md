---
editUrl: false
next: false
prev: false
title: "ErrorResponse"
---

Defined in: [packages/stoma/src/core/errors.ts:43](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/errors.ts#L43)

Standard JSON error response shape returned by all gateway errors.

## Properties

### error

> **error**: `string`

Defined in: [packages/stoma/src/core/errors.ts:45](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/errors.ts#L45)

Machine-readable error code (e.g. `"rate_limited"`, `"unauthorized"`).

***

### message

> **message**: `string`

Defined in: [packages/stoma/src/core/errors.ts:47](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/errors.ts#L47)

Human-readable error description.

***

### requestId?

> `optional` **requestId**: `string`

Defined in: [packages/stoma/src/core/errors.ts:51](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/errors.ts#L51)

Request ID for tracing, when available.

***

### statusCode

> **statusCode**: `number`

Defined in: [packages/stoma/src/core/errors.ts:49](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/errors.ts#L49)

HTTP status code (e.g. 401, 429, 503).
