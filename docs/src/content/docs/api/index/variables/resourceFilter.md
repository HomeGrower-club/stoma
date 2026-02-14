---
editUrl: false
next: false
prev: false
title: "resourceFilter"
---

> `const` **resourceFilter**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/resource-filter.ts:108](https://github.com/HomeGrower-club/stoma/blob/93629a961ba47d055ce6e141df342f8fb137ceba/src/policies/traffic/resource-filter.ts#L108)

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
