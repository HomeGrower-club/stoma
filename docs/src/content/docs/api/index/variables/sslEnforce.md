---
editUrl: false
next: false
prev: false
title: "sslEnforce"
---

> `const` **sslEnforce**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/ssl-enforce.ts:31](https://github.com/HomeGrower-club/stoma/blob/93629a961ba47d055ce6e141df342f8fb137ceba/src/policies/traffic/ssl-enforce.ts#L31)

Enforce HTTPS and append HSTS headers on secure responses.

Detects protocol from `x-forwarded-proto` (or request URL protocol).
For non-HTTPS requests, either redirects to HTTPS (301) or throws 403.

## Parameters

### config?

[`SslEnforceConfig`](/api/policies/interfaces/sslenforceconfig/)

Redirect behavior and HSTS settings.

## Returns

[`Policy`](/api/index/interfaces/policy/)

A [Policy](/api/index/interfaces/policy/) at priority 5 (EARLY).
