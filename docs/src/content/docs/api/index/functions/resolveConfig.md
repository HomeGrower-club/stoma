---
editUrl: false
next: false
prev: false
title: "resolveConfig"
---

> **resolveConfig**\<`TConfig`\>(`defaults`, `userConfig?`): `TConfig`

Defined in: [src/policies/sdk/helpers.ts:28](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/helpers.ts#L28)

Merge default config values with user-provided config.

Performs a shallow merge: `{ ...defaults, ...userConfig }`.
Explicit `undefined` values in userConfig override defaults.

## Type Parameters

### TConfig

`TConfig`

## Parameters

### defaults

`Partial`\<`TConfig`\>

Default values for all optional config fields.

### userConfig?

`Partial`\<`TConfig`\>

User-provided config (may be undefined).

## Returns

`TConfig`

Fully merged config typed as `TConfig`.
