---
editUrl: false
next: false
prev: false
title: "PipelineConfig"
---

Defined in: [src/core/types.ts:121](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/core/types.ts#L121)

Pipeline: ordered chain of policies leading to an upstream

## Properties

### policies?

> `optional` **policies**: [`Policy`](/api/index/interfaces/policy/)[]

Defined in: [src/core/types.ts:123](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/core/types.ts#L123)

Policies executed in order before the upstream

***

### upstream

> **upstream**: [`UpstreamConfig`](/api/index/type-aliases/upstreamconfig/)

Defined in: [src/core/types.ts:125](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/core/types.ts#L125)

Upstream target configuration
