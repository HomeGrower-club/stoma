---
editUrl: false
next: false
prev: false
title: "Policy"
---

Defined in: [src/policies/types.ts:21](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/types.ts#L21)

A Policy is a named Hono middleware with metadata.
Policies are the building blocks of gateway pipelines.

## Properties

### handler

> **handler**: `MiddlewareHandler`

Defined in: [src/policies/types.ts:25](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/types.ts#L25)

The Hono middleware handler

***

### name

> **name**: `string`

Defined in: [src/policies/types.ts:23](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/types.ts#L23)

Unique policy name (e.g. "jwt-auth", "rate-limit")

***

### priority?

> `optional` **priority**: `number`

Defined in: [src/policies/types.ts:27](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/types.ts#L27)

Policy priority — lower numbers execute first. Default: 100.
