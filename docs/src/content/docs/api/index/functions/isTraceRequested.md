---
editUrl: false
next: false
prev: false
title: "isTraceRequested"
---

> **isTraceRequested**(`c`): `boolean`

Defined in: [src/policies/sdk/trace.ts:104](https://github.com/HomeGrower-club/stoma/blob/41d43bd4de6430f6342b8c76661f40e9a2edb625/src/policies/sdk/trace.ts#L104)

Fast-path check: is tracing requested for this request?

## Parameters

### c

`Context`

Hono request context.

## Returns

`boolean`

`true` when the client requested tracing via `x-stoma-debug: trace`.
