---
editUrl: false
next: false
prev: false
title: "Mutation"
---

> **Mutation** = [`HeaderMutation`](/api/index/interfaces/headermutation/) \| [`BodyMutation`](/api/index/interfaces/bodymutation/) \| [`StatusMutation`](/api/index/interfaces/statusmutation/) \| [`AttributeMutation`](/api/index/interfaces/attributemutation/)

Defined in: [src/core/protocol.ts:205](https://github.com/HomeGrower-club/stoma/blob/41d43bd4de6430f6342b8c76661f40e9a2edb625/src/core/protocol.ts#L205)

A discrete modification to apply to the request or response.
Discriminated on `type`.

Designed to map cleanly to ext_proc `HeaderMutation`, `BodyMutation`,
and Envoy dynamic metadata.
