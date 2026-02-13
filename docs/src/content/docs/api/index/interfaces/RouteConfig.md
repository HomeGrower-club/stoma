---
editUrl: false
next: false
prev: false
title: "RouteConfig"
---

Defined in: [packages/stoma/src/core/types.ts:109](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L109)

Individual route configuration

## Properties

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/stoma/src/core/types.ts:117](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L117)

Route-level metadata for logging/observability

***

### methods?

> `optional` **methods**: [`HttpMethod`](/api/index/type-aliases/httpmethod/)[]

Defined in: [packages/stoma/src/core/types.ts:113](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L113)

Allowed HTTP methods. Defaults to all.

***

### path

> **path**: `string`

Defined in: [packages/stoma/src/core/types.ts:111](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L111)

Route path pattern (Hono syntax, e.g. "/users/:id")

***

### pipeline

> **pipeline**: [`PipelineConfig`](/api/index/interfaces/pipelineconfig/)

Defined in: [packages/stoma/src/core/types.ts:115](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L115)

Pipeline to process this route
