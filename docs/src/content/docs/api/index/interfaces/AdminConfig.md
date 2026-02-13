---
editUrl: false
next: false
prev: false
title: "AdminConfig"
---

Defined in: [packages/stoma/src/core/types.ts:182](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L182)

Configuration for the admin introspection API.

## Properties

### auth()?

> `optional` **auth**: (`c`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/stoma/src/core/types.ts:188](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L188)

Optional auth check — return `false` to deny access.

#### Parameters

##### c

`Context`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/stoma/src/core/types.ts:184](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L184)

Enable admin routes. Default: `false`.

***

### metrics?

> `optional` **metrics**: [`MetricsCollector`](/api/index/interfaces/metricscollector/)

Defined in: [packages/stoma/src/core/types.ts:190](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L190)

MetricsCollector instance for the `/metrics` endpoint.

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [packages/stoma/src/core/types.ts:186](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/core/types.ts#L186)

Path prefix for admin routes. Default: `"___gateway"`.
