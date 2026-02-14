---
editUrl: false
next: false
prev: false
title: "UpstreamConfig"
---

> **UpstreamConfig**\<`TBindings`\> = [`UrlUpstream`](/api/index/interfaces/urlupstream/) \| [`ServiceBindingUpstream`](/api/index/interfaces/servicebindingupstream/)\<`TBindings`\> \| [`HandlerUpstream`](/api/index/interfaces/handlerupstream/)

Defined in: [src/core/types.ts:173](https://github.com/HomeGrower-club/stoma/blob/b315766c4c3c5178359b7e4390803aad92732f38/src/core/types.ts#L173)

Upstream target — where the request is forwarded.

## Type Parameters

### TBindings

`TBindings` = `Record`\<`string`, `unknown`\>

Worker bindings type, constrains [ServiceBindingUpstream.service](/api/index/interfaces/servicebindingupstream/#service).
