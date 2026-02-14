---
editUrl: false
next: false
prev: false
title: "TraceReporter"
---

> **TraceReporter** = (`action`, `data?`) => `void`

Defined in: [src/policies/sdk/trace.ts:68](https://github.com/HomeGrower-club/stoma/blob/c64f3a82788fa0548efb551b1e585d1d132c4df7/src/policies/sdk/trace.ts#L68)

A trace reporter function. Always callable — no-op when tracing is inactive.

## Parameters

### action

`string`

Human-readable action string (e.g. `"HIT"`, `"allowed"`).

### data?

`Record`\<`string`, `unknown`\>

Optional structured context data.

## Returns

`void`
