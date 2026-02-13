---
editUrl: false
next: false
prev: false
title: "PipelineSchema"
---

> `const` **PipelineSchema**: `ZodObject`\<\{ `policies`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `handler`: `ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>; `name`: `ZodString`; `priority`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>\>\>; `upstream`: `ZodDiscriminatedUnion`\<\[`ZodObject`\<\{ `headers`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `rewritePath`: `ZodOptional`\<`ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>\>; `target`: `ZodString`; `type`: `ZodLiteral`\<`"url"`\>; \}, `$strip`\>, `ZodObject`\<\{ `rewritePath`: `ZodOptional`\<`ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>\>; `service`: `ZodString`; `type`: `ZodLiteral`\<`"service-binding"`\>; \}, `$strip`\>, `ZodObject`\<\{ `handler`: `ZodFunction`\<`$ZodFunctionArgs`, `$ZodFunctionOut`\>; `type`: `ZodLiteral`\<`"handler"`\>; \}, `$strip`\>\], `"type"`\>; \}, `$strip`\>

Defined in: [src/config/schema.ts:50](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/config/schema.ts#L50)
