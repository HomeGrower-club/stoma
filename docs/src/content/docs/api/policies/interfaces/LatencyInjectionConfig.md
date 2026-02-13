---
editUrl: false
next: false
prev: false
title: "LatencyInjectionConfig"
---

Defined in: [src/policies/resilience/latency-injection.ts:10](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/resilience/latency-injection.ts#L10)

Configuration for the latencyInjection policy.

## Extends

- [`PolicyConfig`](/api/index/interfaces/policyconfig/)

## Properties

### delayMs

> **delayMs**: `number`

Defined in: [src/policies/resilience/latency-injection.ts:12](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/resilience/latency-injection.ts#L12)

Base delay in milliseconds. Required.

***

### jitter?

> `optional` **jitter**: `number`

Defined in: [src/policies/resilience/latency-injection.ts:14](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/resilience/latency-injection.ts#L14)

Jitter proportion (0 to 1). Actual delay varies by +/- jitter * delayMs. Default: 0.

***

### probability?

> `optional` **probability**: `number`

Defined in: [src/policies/resilience/latency-injection.ts:16](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/resilience/latency-injection.ts#L16)

Probability of injecting latency (0 to 1). Default: 1 (always).

***

### skip()?

> `optional` **skip**: (`c`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [src/policies/types.ts:69](https://github.com/HomeGrower-club/stoma/blob/c02d84b2ff5af3b1f7cb6124493cc3582359d8b0/src/policies/types.ts#L69)

Skip this policy when condition returns true

#### Parameters

##### c

`unknown`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

#### Inherited from

[`PolicyConfig`](/api/index/interfaces/policyconfig/).[`skip`](/api/index/interfaces/policyconfig/#skip)
