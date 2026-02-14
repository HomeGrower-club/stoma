---
editUrl: false
next: false
prev: false
title: "RateLimitStore"
---

Defined in: [src/policies/traffic/rate-limit.ts:30](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/rate-limit.ts#L30)

Pluggable storage backend for rate limit counters

## Methods

### destroy()?

> `optional` **destroy**(): `void`

Defined in: [src/policies/traffic/rate-limit.ts:37](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/rate-limit.ts#L37)

Optional: cleanup resources (like intervals) used by the store

#### Returns

`void`

***

### increment()

> **increment**(`key`, `windowSeconds`): `Promise`\<\{ `count`: `number`; `resetAt`: `number`; \}\>

Defined in: [src/policies/traffic/rate-limit.ts:32](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/rate-limit.ts#L32)

Increment the counter for a key, returning the new count and TTL

#### Parameters

##### key

`string`

##### windowSeconds

`number`

#### Returns

`Promise`\<\{ `count`: `number`; `resetAt`: `number`; \}\>
