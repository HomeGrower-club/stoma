---
editUrl: false
next: false
prev: false
title: "TraceReporter"
---

> **TraceReporter** = (`action`, `data?`) => `void`

Defined in: [src/policies/sdk/trace.ts:68](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/sdk/trace.ts#L68)

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
