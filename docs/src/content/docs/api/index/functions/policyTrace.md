---
editUrl: false
next: false
prev: false
title: "policyTrace"
---

> **policyTrace**(`c`, `policyName`): [`TraceReporter`](/api/index/type-aliases/tracereporter/)

Defined in: packages/stoma/src/policies/sdk/trace.ts:84

Get a trace reporter for a specific policy.

When tracing is active (`_stomaTraceRequested` is truthy), returns a
function that stores the detail on the context. When inactive, returns
noopTraceReporter — a no-op with zero overhead.

## Parameters

### c

`Context`

Hono request context.

### policyName

`string`

Policy name used as the Map key.

## Returns

[`TraceReporter`](/api/index/type-aliases/tracereporter/)

A [TraceReporter](/api/index/type-aliases/tracereporter/) — always callable.
