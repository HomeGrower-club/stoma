---
editUrl: false
next: false
prev: false
title: "isTraceRequested"
---

> **isTraceRequested**(`c`): `boolean`

Defined in: [src/policies/sdk/trace.ts:104](https://github.com/HomeGrower-club/stoma/blob/c64f3a82788fa0548efb551b1e585d1d132c4df7/src/policies/sdk/trace.ts#L104)

Fast-path check: is tracing requested for this request?

## Parameters

### c

`Context`

Hono request context.

## Returns

`boolean`

`true` when the client requested tracing via `x-stoma-debug: trace`.
