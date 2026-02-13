---
editUrl: false
next: false
prev: false
title: "getGatewayContext"
---

> **getGatewayContext**(`c`): [`PolicyContext`](/api/index/interfaces/policycontext/) \| `undefined`

Defined in: [src/core/pipeline.ts:356](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/core/pipeline.ts#L356)

Retrieve the [PolicyContext](/api/index/interfaces/policycontext/) from a Hono context.

Returns `undefined` if called outside the gateway pipeline (e.g. in
a standalone Hono app without context injection).

## Parameters

### c

`Context`

The Hono request context.

## Returns

[`PolicyContext`](/api/index/interfaces/policycontext/) \| `undefined`

The gateway context, or `undefined` if not in a gateway pipeline.
