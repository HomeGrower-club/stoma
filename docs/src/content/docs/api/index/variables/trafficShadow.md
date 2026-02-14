---
editUrl: false
next: false
prev: false
title: "trafficShadow"
---

> `const` **trafficShadow**: (`config`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/traffic-shadow.ts:58](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/traffic-shadow.ts#L58)

Traffic shadow policy.

Mirrors traffic to a secondary upstream after the primary response
is ready. The shadow request is fire-and-forget and never affects
the primary response.

## Parameters

### config

[`TrafficShadowConfig`](/api/policies/interfaces/trafficshadowconfig/)

## Returns

[`Policy`](/api/index/interfaces/policy/)

## Example

```ts
import { trafficShadow } from "@homegrower-club/stoma";

trafficShadow({
  target: "https://shadow.internal",
  percentage: 10,
  methods: ["POST", "PUT"],
});
```
