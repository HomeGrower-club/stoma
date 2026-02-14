---
editUrl: false
next: false
prev: false
title: "resourceFilter"
---

> `const` **resourceFilter**: (`config`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [src/policies/traffic/resource-filter.ts:110](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/resource-filter.ts#L110)

Strip or allow fields from JSON responses.

## Parameters

### config

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
