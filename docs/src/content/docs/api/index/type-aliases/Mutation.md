---
editUrl: false
next: false
prev: false
title: "Mutation"
---

> **Mutation** = [`HeaderMutation`](/api/index/interfaces/headermutation/) \| [`BodyMutation`](/api/index/interfaces/bodymutation/) \| [`StatusMutation`](/api/index/interfaces/statusmutation/) \| [`AttributeMutation`](/api/index/interfaces/attributemutation/)

Defined in: [src/core/protocol.ts:205](https://github.com/HomeGrower-club/stoma/blob/51850db26f18dce0fb4866cdcbc9eec2bad7561e/src/core/protocol.ts#L205)

A discrete modification to apply to the request or response.
Discriminated on `type`.

Designed to map cleanly to ext_proc `HeaderMutation`, `BodyMutation`,
and Envoy dynamic metadata.
