---
editUrl: false
next: false
prev: false
title: "safeValidateConfig"
---

> **safeValidateConfig**(`config`): \{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}

Defined in: [src/config/schema.ts:168](https://github.com/HomeGrower-club/stoma/blob/6880413a743383e902605a267467fc2697cf2b73/src/config/schema.ts#L168)

Safely validate a gateway config, returning success/error without throwing.

## Parameters

### config

`unknown`

## Returns

\{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}
