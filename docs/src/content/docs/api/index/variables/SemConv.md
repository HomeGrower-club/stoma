---
editUrl: false
next: false
prev: false
title: "SemConv"
---

> `const` **SemConv**: `object`

Defined in: [src/observability/tracing.ts:73](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/observability/tracing.ts#L73)

OTel semantic convention attribute keys (HTTP subset).

Uses the stable HTTP semconv names from the OpenTelemetry specification.

## Type Declaration

### HTTP\_METHOD

> `readonly` **HTTP\_METHOD**: `"http.request.method"` = `"http.request.method"`

### HTTP\_ROUTE

> `readonly` **HTTP\_ROUTE**: `"http.route"` = `"http.route"`

### HTTP\_STATUS\_CODE

> `readonly` **HTTP\_STATUS\_CODE**: `"http.response.status_code"` = `"http.response.status_code"`

### SERVER\_ADDRESS

> `readonly` **SERVER\_ADDRESS**: `"server.address"` = `"server.address"`

### URL\_PATH

> `readonly` **URL\_PATH**: `"url.path"` = `"url.path"`

## See

https://opentelemetry.io/docs/specs/semconv/http/
