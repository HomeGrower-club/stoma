---
editUrl: false
next: false
prev: false
title: "InMemoryRateLimitStoreOptions"
---

Defined in: [src/policies/traffic/rate-limit.ts:38](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/traffic/rate-limit.ts#L38)

Default in-memory rate limit store

## Properties

### cleanupIntervalMs?

> `optional` **cleanupIntervalMs**: `number`

Defined in: [src/policies/traffic/rate-limit.ts:42](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/traffic/rate-limit.ts#L42)

Cleanup interval in ms for expired entries. Default: 60000.

***

### maxKeys?

> `optional` **maxKeys**: `number`

Defined in: [src/policies/traffic/rate-limit.ts:40](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/traffic/rate-limit.ts#L40)

Maximum number of unique keys to prevent memory exhaustion. Default: 100000.
