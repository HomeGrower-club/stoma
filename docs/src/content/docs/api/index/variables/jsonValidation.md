---
editUrl: false
next: false
prev: false
title: "jsonValidation"
---

> `const` **jsonValidation**: (`config?`) => [`Policy`](/api/index/interfaces/policy/)

Defined in: [packages/stoma/src/policies/transform/json-validation.ts:58](https://github.com/HomeGrower-club/stoma/blob/84fe1aecb88a4fe423283b627a19d56fda29a9cb/src/policies/transform/json-validation.ts#L58)

Pluggable JSON body validation policy.

Validates the request body using a user-provided function. When no
`validate` function is configured, checks that the body is parseable JSON.
Requests with content types not in the configured list pass through
without validation.

## Parameters

### config?

[`JsonValidationConfig`](/api/policies/interfaces/jsonvalidationconfig/)

## Returns

[`Policy`](/api/index/interfaces/policy/)

## Example

```ts
import { jsonValidation } from "@homegrower-club/stoma";

// With Zod
jsonValidation({
  validate: (body) => {
    const result = myZodSchema.safeParse(body);
    return {
      valid: result.success,
      errors: result.success ? undefined : result.error.issues.map(i => i.message),
    };
  },
});

// Just validate JSON is parseable (no validate function)
jsonValidation();
```
