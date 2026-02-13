---
"@homegrower-club/stoma": patch
---

Protocol-agnostic policy evaluation, docs editor improvements, lint fixes

- Multi-protocol policy architecture: `PolicyInput`, `PolicyResult`, `PolicyEvaluator` types enabling policies to run outside HTTP (ext_proc, WebSocket)
- `ipFilter` now exposes `evaluate.onRequest` alongside the existing Hono `handler`
- Docs editor: Hono types inlined into the stoma type bundle via `--external-inlines hono` (removes hand-written stubs)
- Docs editor: subpath registration for Monaco IntelliSense (`/sdk`, `/config`, `/adapters/*`)
- Fixed broken `EditorLink` component (`_href` → `href`)
- Lint error cleanup
