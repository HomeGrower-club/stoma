---
editUrl: false
next: false
prev: false
title: "resolveConfig"
---

> **resolveConfig**\<`TConfig`\>(`defaults`, `userConfig?`): `TConfig`

Defined in: [src/policies/sdk/helpers.ts:29](https://github.com/HomeGrower-club/stoma/blob/6880413a743383e902605a267467fc2697cf2b73/src/policies/sdk/helpers.ts#L29)

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
