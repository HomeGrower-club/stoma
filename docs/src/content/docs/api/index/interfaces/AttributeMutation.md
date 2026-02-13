---
editUrl: false
next: false
prev: false
title: "AttributeMutation"
---

Defined in: [src/core/protocol.ts:249](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/core/protocol.ts#L249)

Set a cross-policy attribute.

Downstream policies see this value in [PolicyInput.attributes](/api/index/interfaces/policyinput/#attributes).
In ext_proc, this maps to Envoy dynamic metadata.

## Properties

### key

> **key**: `string`

Defined in: [src/core/protocol.ts:252](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/core/protocol.ts#L252)

Attribute key. Use namespaced keys (e.g. `"auth.user_id"`) to avoid collisions.

***

### type

> **type**: `"attribute"`

Defined in: [src/core/protocol.ts:250](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/core/protocol.ts#L250)

***

### value

> **value**: `unknown`

Defined in: [src/core/protocol.ts:254](https://github.com/HomeGrower-club/stoma/blob/91cf89ae0b96ccb0f8af15ac6a2b07861cac9ef6/src/core/protocol.ts#L254)

Attribute value.
