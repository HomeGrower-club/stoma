---
editUrl: false
next: false
prev: false
title: "assignContent"
---

> `const` **assignContent**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/transform/assign-content.ts:78](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/transform/assign-content.ts#L78)

Assign content policy.

Injects or overrides fields in JSON request and/or response bodies.
Useful for injecting tenant IDs, timestamps, metadata, or other
fields that should be transparently added by the gateway.

## Parameters

### config?

[`AssignContentConfig`](/api/policies/interfaces/assigncontentconfig/)

## Returns

[`Policy`](/api/index/interfaces/policy/)

## Example

```ts
import { assignContent } from "@homegrower-club/stoma";

assignContent({
  request: {
    tenantId: "acme",
    timestamp: (c) => new Date().toISOString(),
  },
  response: {
    gateway: "stoma",
  },
});
```
