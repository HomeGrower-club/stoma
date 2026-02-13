---
editUrl: false
next: false
prev: false
title: "safeValidateConfig"
---

> **safeValidateConfig**(`config`): \{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}

Defined in: [src/config/schema.ts:155](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/config/schema.ts#L155)

Safely validate a gateway config, returning success/error without throwing.

## Parameters

### config

`unknown`

## Returns

\{ `data`: [`GatewayConfig`](/api/index/interfaces/gatewayconfig/); `success`: `true`; \} \| \{ `error`: `ZodError`; `success`: `false`; \}
