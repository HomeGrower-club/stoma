---
editUrl: false
next: false
prev: false
title: "DebugHeadersConfig"
---

Defined in: [packages/stoma/src/core/types.ts:101](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L101)

Configuration for client-requested debug headers.

## Properties

### allow?

> `optional` **allow**: `string`[]

Defined in: [packages/stoma/src/core/types.ts:105](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L105)

Allowlist of debug header names clients can request. When set, only these headers are emitted. Default: all.

***

### requestHeader?

> `optional` **requestHeader**: `string`

Defined in: [packages/stoma/src/core/types.ts:103](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L103)

Request header name clients use to request debug values. Default: `"x-stoma-debug"`.
