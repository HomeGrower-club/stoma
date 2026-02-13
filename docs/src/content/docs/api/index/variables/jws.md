---
editUrl: false
next: false
prev: false
title: "jws"
---

> `const` **jws**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/auth/jws.ts:71](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/auth/jws.ts#L71)

Verify JWS compact serialization signatures on requests.

The `none` algorithm is always rejected to prevent signature bypass attacks.
Config validation (`secret` or `jwksUrl` required) is performed at construction
time — a missing config throws immediately, not on first request.

## Parameters

### config?

[`JwsConfig`](/api/policies/interfaces/jwsconfig/)

## Returns

[`Policy`](/api/index/interfaces/policy/)

## Example

```ts
import { jws } from "@homegrower-club/stoma";

// HMAC verification with embedded payload
jws({ secret: env.JWS_SECRET });

// Detached JWS — payload comes from the request body
jws({ secret: env.JWS_SECRET, payloadSource: "body" });
```
