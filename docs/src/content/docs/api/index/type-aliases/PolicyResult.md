---
editUrl: false
next: false
prev: false
title: "PolicyResult"
---

> **PolicyResult** = [`PolicyContinue`](/api/index/interfaces/policycontinue/) \| [`PolicyReject`](/api/index/interfaces/policyreject/) \| [`PolicyImmediateResponse`](/api/index/interfaces/policyimmediateresponse/)

Defined in: [src/core/protocol.ts:142](https://github.com/HomeGrower-club/stoma/blob/162619492d6688db22e8617fe051bccc1c9cffc5/src/core/protocol.ts#L142)

The outcome of a policy evaluation. Discriminated on `action`.

- `"continue"` - Allow processing to continue, optionally with mutations.
- `"reject"` - Reject with a structured error response.
- `"immediate-response"` - Short-circuit with a complete non-error response.
