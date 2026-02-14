---
editUrl: false
next: false
prev: false
title: "timingSafeEqual"
---

> **timingSafeEqual**(`a`, `b`): `boolean`

Defined in: [src/utils/timing-safe.ts:30](https://github.com/HomeGrower-club/stoma/blob/41d43bd4de6430f6342b8c76661f40e9a2edb625/src/utils/timing-safe.ts#L30)

Compare two strings in constant time.

Returns `true` if `a` and `b` are identical, `false` otherwise.
The comparison always examines every byte of the longer string,
preventing timing side-channels that leak prefix information.

## Parameters

### a

`string`

First string to compare.

### b

`string`

Second string to compare.

## Returns

`boolean`

`true` if the strings are identical.

## Example

```ts
import { timingSafeEqual } from "@homegrower-club/stoma";

// Use in API key validators to prevent timing attacks
const isValid = timingSafeEqual(providedKey, storedKey);
```
