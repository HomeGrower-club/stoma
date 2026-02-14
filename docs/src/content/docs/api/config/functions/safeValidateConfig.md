---
editUrl: false
next: false
prev: false
title: "safeValidateConfig"
---

> **safeValidateConfig**(`config`): \{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}

Defined in: [src/config/schema.ts:168](https://github.com/HomeGrower-club/stoma/blob/c64f3a82788fa0548efb551b1e585d1d132c4df7/src/config/schema.ts#L168)

Safely validate a gateway config, returning success/error without throwing.

## Parameters

### config

`unknown`

## Returns

\{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}
