---
editUrl: false
next: false
prev: false
title: "ServerTimingConfig"
---

Defined in: packages/stoma/src/policies/observability/server-timing.ts:24

Configuration for the [serverTiming](/api/index/variables/servertiming/) policy.

## Extends

- [`PolicyConfig`](/api/index/interfaces/policyconfig/)

## Properties

### descriptionFn()?

> `optional` **descriptionFn**: (`name`) => `string`

Defined in: packages/stoma/src/policies/observability/server-timing.ts:34

Optional function to generate a description for each timing entry.

#### Parameters

##### name

`string`

#### Returns

`string`

***

### includeTotal?

> `optional` **includeTotal**: `boolean`

Defined in: packages/stoma/src/policies/observability/server-timing.ts:32

Add a `total` entry to `Server-Timing`. Default: `true`.

***

### precision?

> `optional` **precision**: `number`

Defined in: packages/stoma/src/policies/observability/server-timing.ts:30

Number of decimal places for duration values. Default: `1`.

***

### responseTimeHeader?

> `optional` **responseTimeHeader**: `boolean`

Defined in: packages/stoma/src/policies/observability/server-timing.ts:28

Emit the `X-Response-Time` header with total gateway time. Default: `true`.

***

### serverTimingHeader?

> `optional` **serverTimingHeader**: `boolean`

Defined in: packages/stoma/src/policies/observability/server-timing.ts:26

Emit the `Server-Timing` header with per-policy breakdown. Default: `true`.

***

### skip()?

> `optional` **skip**: (`c`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/stoma/src/policies/types.ts:33](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/policies/types.ts#L33)

Skip this policy when condition returns true

#### Parameters

##### c

`unknown`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

#### Inherited from

[`PolicyConfig`](/api/index/interfaces/policyconfig/).[`skip`](/api/index/interfaces/policyconfig/#skip)

***

### visibility?

> `optional` **visibility**: [`ServerTimingVisibility`](/api/index/type-aliases/servertimingvisibility/)

Defined in: packages/stoma/src/policies/observability/server-timing.ts:36

Controls when timing headers are emitted. Default: `"debug-only"`.

***

### visibilityFn()?

> `optional` **visibilityFn**: (`c`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: packages/stoma/src/policies/observability/server-timing.ts:38

Required when `visibility` is `"conditional"`. Called per-request to decide.

#### Parameters

##### c

`Context`

#### Returns

`boolean` \| `Promise`\<`boolean`\>
