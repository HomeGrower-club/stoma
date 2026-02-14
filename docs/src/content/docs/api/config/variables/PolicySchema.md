---
editUrl: false
next: false
prev: false
title: "PolicySchema"
---

> `const` **PolicySchema**: `ZodObject`\<\{ `handler`: `ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>; `name`: `ZodString`; `priority`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: [src/config/schema.ts:33](https://github.com/HomeGrower-club/stoma/blob/6880413a743383e902605a267467fc2697cf2b73/src/config/schema.ts#L33)

Validates the Policy shape (name + handler + priority).

This only checks that a policy _looks_ like a Policy — it does not validate
the policy's own config options. Policy-specific validation happens inside
each policy factory via `resolveConfig()` at construction time.
