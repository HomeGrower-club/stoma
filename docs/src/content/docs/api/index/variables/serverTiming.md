---
editUrl: false
next: false
prev: false
title: "serverTiming"
---

> `const` **serverTiming**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/observability/server-timing.ts:76](https://github.com/HomeGrower-club/stoma/blob/41d43bd4de6430f6342b8c76661f40e9a2edb625/src/policies/observability/server-timing.ts#L76)

Emit W3C `Server-Timing` and `X-Response-Time` response headers.

Reads per-policy timing data from the pipeline instrumentation and
formats it as standard headers visible in browser DevTools.

## Parameters

### config?

[`ServerTimingConfig`](/api/index/interfaces/servertimingconfig/)

Optional configuration for headers, precision, and visibility.

## Returns

[`Policy`](/api/index/interfaces/policy/)

A [Policy](/api/index/interfaces/policy/) at priority 1 (METRICS).
