---
editUrl: false
next: false
prev: false
title: "RequestLimitConfig"
---

Defined in: [src/policies/traffic/request-limit.ts:11](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/request-limit.ts#L11)

Configuration for the requestLimit policy.

## Extends

- [`PolicyConfig`](/api/index/interfaces/policyconfig/)

## Properties

### maxBytes

> **maxBytes**: `number`

Defined in: [src/policies/traffic/request-limit.ts:13](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/request-limit.ts#L13)

Maximum allowed body size in bytes (based on Content-Length).

***

### message?

> `optional` **message**: `string`

Defined in: [src/policies/traffic/request-limit.ts:15](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/traffic/request-limit.ts#L15)

Custom error message. Default: "Request body too large".

***

### skip()?

> `optional` **skip**: (`c`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [src/policies/types.ts:90](https://github.com/HomeGrower-club/stoma/blob/75d04472e736fafe9528e258514a9fe3e352e511/src/policies/types.ts#L90)

Skip this policy when condition returns true

#### Parameters

##### c

`unknown`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

#### Inherited from

[`PolicyConfig`](/api/index/interfaces/policyconfig/).[`skip`](/api/index/interfaces/policyconfig/#skip)
