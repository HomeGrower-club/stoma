---
editUrl: false
next: false
prev: false
title: "resourceFilter"
---

> `const` **resourceFilter**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/resource-filter.ts:108](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/traffic/resource-filter.ts#L108)

Strip or allow fields from JSON responses.

## Parameters

### config?

[`ResourceFilterConfig`](/api/policies/interfaces/resourcefilterconfig/)

## Returns

[`Policy`](/api/index/interfaces/policy/)

## Example

```ts
import { resourceFilter } from "@homegrower-club/stoma";

// Remove sensitive fields
resourceFilter({
  mode: "deny",
  fields: ["password", "user.ssn"],
});

// Keep only specific fields
resourceFilter({
  mode: "allow",
  fields: ["id", "name", "email"],
});
```
