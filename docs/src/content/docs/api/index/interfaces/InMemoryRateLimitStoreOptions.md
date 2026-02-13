---
editUrl: false
next: false
prev: false
title: "InMemoryRateLimitStoreOptions"
---

Defined in: [src/policies/traffic/rate-limit.ts:49](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/traffic/rate-limit.ts#L49)

Default in-memory rate limit store

## Properties

### cleanupIntervalMs?

> `optional` **cleanupIntervalMs**: `number`

Defined in: [src/policies/traffic/rate-limit.ts:53](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/traffic/rate-limit.ts#L53)

Cleanup interval in ms for expired entries. Default: 60000.

***

### maxKeys?

> `optional` **maxKeys**: `number`

Defined in: [src/policies/traffic/rate-limit.ts:51](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/traffic/rate-limit.ts#L51)

Maximum number of unique keys to prevent memory exhaustion. Default: 100000.
