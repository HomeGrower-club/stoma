---
editUrl: false
next: false
prev: false
title: "requestTransform"
---

> `const` **requestTransform**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/transform/transform.ts:53](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/transform/transform.ts#L53)

Modify request headers before they reach the upstream service.

Applies header transformations in order: rename → set → remove. Handles
Cloudflare Workers' immutable `Request.headers` by cloning the request
with modified headers.

## Parameters

### config?

[`RequestTransformConfig`](/api/policies/interfaces/requesttransformconfig/)

Header set/remove/rename operations. At least one should be provided.

## Returns

[`Policy`](/api/index/interfaces/policy/)

A [Policy](/api/index/interfaces/policy/) at priority 50 (mid-pipeline, after auth, before upstream).

## Example

```ts
import { requestTransform } from "@homegrower-club/stoma/policies";

// Add API version header and strip cookies
requestTransform({
  setHeaders: { "x-api-version": "2024-01-01" },
  removeHeaders: ["cookie"],
});

// Rename a legacy header to the new convention
requestTransform({
  renameHeaders: { "x-old-auth": "authorization" },
});
```
