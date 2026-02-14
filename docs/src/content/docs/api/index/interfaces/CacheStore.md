---
editUrl: false
next: false
prev: false
title: "CacheStore"
---

Defined in: [src/policies/traffic/cache.ts:21](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/policies/traffic/cache.ts#L21)

Pluggable cache storage backend

## Methods

### delete()

> **delete**(`key`): `Promise`\<`boolean`\>

Defined in: [src/policies/traffic/cache.ts:27](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/policies/traffic/cache.ts#L27)

Delete a cached entry. Returns true if something was removed.

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`boolean`\>

***

### get()

> **get**(`key`): `Promise`\<`Response` \| `null`\>

Defined in: [src/policies/traffic/cache.ts:23](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/policies/traffic/cache.ts#L23)

Retrieve a cached response by key. Returns null on miss.

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`Response` \| `null`\>

***

### put()

> **put**(`key`, `response`, `ttlSeconds`): `Promise`\<`void`\>

Defined in: [src/policies/traffic/cache.ts:25](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/policies/traffic/cache.ts#L25)

Store a response under key with a TTL in seconds.

#### Parameters

##### key

`string`

##### response

`Response`

##### ttlSeconds

`number`

#### Returns

`Promise`\<`void`\>
