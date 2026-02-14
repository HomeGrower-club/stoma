---
editUrl: false
next: false
prev: false
title: "defaultErrorResponse"
---

> **defaultErrorResponse**(`requestId?`, `message?`): `Response`

Defined in: [src/core/errors.ts:98](https://github.com/HomeGrower-club/stoma/blob/41d43bd4de6430f6342b8c76661f40e9a2edb625/src/core/errors.ts#L98)

Produce a generic 500 error response for unexpected (non-[GatewayError](/api/index/classes/gatewayerror/)) errors.

Used by the global error handler when an unrecognized error reaches the
gateway boundary. Does not leak internal error details.

## Parameters

### requestId?

`string`

Optional request ID to include in the response body.

### message?

`string` = `"An unexpected error occurred"`

## Returns

`Response`

A 500 `Response` with a generic error message.
