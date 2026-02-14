---
editUrl: false
next: false
prev: false
title: "isDebugRequested"
---

> **isDebugRequested**(`c`): `boolean`

Defined in: [src/policies/sdk/helpers.ts:244](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/sdk/helpers.ts#L244)

Check whether the client requested debug output via the `x-stoma-debug` header.

Returns `true` when any debug header names were requested (i.e. the
`_stomaDebugRequested` context key is a non-empty Set).

## Parameters

### c

`Context`

Hono request context.

## Returns

`boolean`

`true` if the client sent a valid `x-stoma-debug` request header.
