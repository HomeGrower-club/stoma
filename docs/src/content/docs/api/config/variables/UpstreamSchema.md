---
editUrl: false
next: false
prev: false
title: "UpstreamSchema"
---

> `const` **UpstreamSchema**: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `headers`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `rewritePath`: `ZodOptional`\<`ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>\>; `target`: `ZodString`; `type`: `ZodLiteral`\<`"url"`\>; \}, `$strip`\>, `ZodObject`\<\{ `rewritePath`: `ZodOptional`\<`ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>\>; `service`: `ZodString`; `type`: `ZodLiteral`\<`"service-binding"`\>; \}, `$strip`\>, `ZodObject`\<\{ `handler`: `ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>; `type`: `ZodLiteral`\<`"handler"`\>; \}, `$strip`\>\], `"type"`\>

Defined in: [src/config/schema.ts:44](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/config/schema.ts#L44)
