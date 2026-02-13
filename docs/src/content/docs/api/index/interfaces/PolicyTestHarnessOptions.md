---
editUrl: false
next: false
prev: false
title: "PolicyTestHarnessOptions"
---

Defined in: [src/policies/sdk/testing.ts:18](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/testing.ts#L18)

## Properties

### adapter?

> `optional` **adapter**: [`TestAdapter`](/api/adapters/classes/testadapter/)

Defined in: [src/policies/sdk/testing.ts:29](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/testing.ts#L29)

Custom adapter to use. If not provided, a [TestAdapter](/api/adapters/classes/testadapter/) is created.

***

### gatewayName?

> `optional` **gatewayName**: `string`

Defined in: [src/policies/sdk/testing.ts:27](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/testing.ts#L27)

Gateway name injected into context. Default: `"test-gateway"`.

***

### path?

> `optional` **path**: `string`

Defined in: [src/policies/sdk/testing.ts:25](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/testing.ts#L25)

Route path pattern for the test app. Default: `"/*"`.

***

### upstream?

> `optional` **upstream**: `MiddlewareHandler`

Defined in: [src/policies/sdk/testing.ts:23](https://github.com/HomeGrower-club/stoma/blob/603a10a50487a87e6d616a573f00ffc30e2678e1/src/policies/sdk/testing.ts#L23)

Custom upstream handler. Receives the Hono context after the policy
runs. Default: returns `{ ok: true }` with status 200.
