# Developer Roadmap (Aspirational)

This document outlines the long-term vision for making Stoma the most ergonomic and powerful API gateway for TypeScript developers. These are aspirational goals designed to guide future development.

## Multi-Runtime Architecture

The core strategic direction: **Stoma's policy layer is protocol-agnostic; Hono is the HTTP adapter.**

The `Policy` interface supports two entry points: `handler` (Hono middleware for the HTTP runtime) and `evaluate` (protocol-agnostic evaluator for any runtime). This dual-entry design was introduced in Phase 4 via `src/core/protocol.ts` and is fully type-safe with zero runtime overhead for the HTTP path.

### 12. Protocol-Agnostic Policy Layer ✅
**Status:** Type foundations shipped. `PolicyInput`, `PolicyResult`, `PolicyEvaluator`, `ProcessingPhase`, and the mutation system are all in `src/core/protocol.ts`. `definePolicy()` supports both `handler` and `evaluate` in a single definition. The HTTP runtime (`createGateway`) continues to use `handler` only — `evaluate` is for non-HTTP runtimes.

### 13. Envoy ext_proc Runtime
**Problem:** Envoy-based load balancers (GCP Global LB, AWS ALB via Envoy, Istio service mesh) support an External Processing filter that delegates policy decisions to a gRPC service. Today, users must write ext_proc services in Go/C++ or use proprietary solutions.

**Solution:** A `createExtProcServer()` entry point that takes the same policy array as `createGateway()` but serves them over a gRPC bidirectional stream using the Connect protocol (`@connectrpc/connect`, ~12KB).

```typescript
import { createExtProcServer } from "@homegrower-club/stoma/runtimes/ext-proc";
import { jwtAuth, rateLimit, cors } from "@homegrower-club/stoma";

const server = createExtProcServer({
  policies: [cors(), jwtAuth({ jwksUrl: "..." }), rateLimit({ max: 100 })],
});
// Deploy as a Cloudflare Worker, Docker container, or any edge runtime
```

**Processing phases** (all 6 from the Envoy ext_proc spec):
- `request-headers`, `request-body`, `request-trailers`
- `response-headers`, `response-body`, `response-trailers`

Each policy declares which phases it participates in via `phases`. The ext_proc runtime skips policies that don't apply to the current phase.

**Key design decisions:**
- Connect protocol (not raw gRPC) — works over HTTP/2 and HTTP/1.1, compiles small for edge
- Policies use `evaluate.onRequest` / `evaluate.onResponse` — the runtime maps phases to the appropriate evaluator
- `PolicyResult` mutations map directly to ext_proc `HeaderMutation`, `BodyMutation`, and `ImmediateResponse`
- Same policy instance works in both `createGateway()` (HTTP) and `createExtProcServer()` (gRPC)

### 14. WebSocket Runtime
**Problem:** WebSocket connections need policy evaluation at connection upgrade time and optionally on individual frames, but the HTTP middleware model doesn't fit.

**Solution:** A `createWebSocketGateway()` that evaluates policies on the upgrade request using `evaluate.onRequest`, then optionally applies frame-level policies using `evaluate.onResponse` for server→client frames.

### 15. HTTP Bridge (evaluate → middleware)
**Problem:** Policy authors who implement both `handler` and `evaluate` duplicate logic.

**Solution:** An `evaluateToMiddleware()` adapter that wraps a policy's `evaluate` functions into a Hono middleware handler. This allows policy authors to write `evaluate` once and have it work on both the HTTP and non-HTTP runtimes.

```typescript
import { evaluateToMiddleware } from "@homegrower-club/stoma/sdk";

// If a policy only has `evaluate`, the HTTP runtime can auto-bridge it
const httpHandler = evaluateToMiddleware(myPolicy.evaluate);
```

### 16. Built-in Policy Migration
**Problem:** All 43 built-in policies currently only implement `handler`. To be useful with ext_proc/WebSocket runtimes, they need `evaluate` too.

**Solution:** Progressively add `evaluate` implementations to built-in policies, starting with the most universally useful: auth policies (jwt-auth, api-key-auth, oauth2), traffic policies (rate-limit, ip-filter), and transform policies (cors, request/response transforms). Non-HTTP-specific policies like circuit-breaker and retry may not need `evaluate` since those concerns are handled by Envoy itself in the ext_proc model.

## Core Ergonomics & Composition

### 1. Route Groups & Scopes
**Problem:** Applying policies to a subset of routes (e.g., all `/admin/*` routes need RBAC) currently requires repeating the policy in every route's pipeline or using a global policy with a complex `skip` condition.
**Solution:** Introduce a `Scope` or `Group` concept in the configuration.
```typescript
const adminRoutes = scope({
  prefix: "/admin",
  policies: [jwtAuth(), rbac({ role: "admin" })],
  routes: [
    { path: "/users", ... },
    { path: "/settings", ... }
  ]
});
```

### 2. Configuration Splitting
**Problem:** A single `gateway.ts` file can get huge.
**Solution:** First-class support for loading route definitions from multiple files/modules, potentially with auto-discovery or a simple `mergeConfigs` utility.

### 3. Type-Safe Upstream Bindings
**Problem:** `ServiceBindingUpstream` relies on stringly-typed service names (`service: "AUTH_SERVICE"`).
**Solution:** Use TypeScript generics to validate service names against the user's `Env` interface.

## Developer Experience (DX)

### 4. CLI Scaffolding
**Problem:** Creating a new policy or setting up a fresh gateway requires boilerplate.
**Solution:** A `stoma` CLI.
- `npx stoma create my-gateway`
- `npx stoma add policy my-custom-policy`
- `npx stoma dev` (wrapper around wrangler/node with hot reload)

### 5. Simulator / Playground
**Problem:** Testing complex policy chains requires running the full stack.
**Solution:** A web-based (or CLI-based) simulator where you can input a request (path, headers) and see exactly which policies run, why a request was rejected, and what the upstream request looks like. "Trace my request".

### 6. Testing Harness
**Problem:** Users need to write tests for their gateway configuration to ensure policies are applied correctly.
**Solution:** Export a `createTestClient(config)` helper that mocks upstreams and allows asserting on:
- Response status/headers
- Upstream request payloads (was the path rewritten correctly?)
- Policy execution (did the rate limiter trigger?)

## Observability & Operations

### 7. OpenTelemetry Integration
**Problem:** Current tracing is W3C-compatible but custom.
**Solution:** Native integration with OpenTelemetry for comprehensive spans, trace propagation, and metrics export to generic OTLP collectors.

### 8. Live Configuration Reload (Runtime)
**Problem:** Changing config requires a deploy (or restart).
**Solution:** (Aspirational) Load config from a Durable Object or KV at runtime, allowing updates without redeploying the Worker. *Note: This trades some type safety for flexibility.*

## Ecosystem

### 9. Policy Marketplace / Presets
**Problem:** Everyone re-implements "Stripe Webhook Verification" or "Auth0 Validation".
**Solution:** A community repository of pre-configured policy presets.

### 10. Framework & Runtime Integrations
**Problem:** Stoma's policy engine is powerful but users need clear integration paths for their specific runtime.
**Solution:** Drop-in integrations at multiple levels:
- **Framework middleware**: Next.js, Remix, Nuxt — run `createGateway()` as server middleware
- **Runtime adapters**: Node.js (`node:http`), Deno (`Deno.serve`), Bun (`Bun.serve`) — Hono already provides these; Stoma inherits them
- **Infrastructure integration**: Envoy ext_proc, Istio WASM, AWS API Gateway custom authorizers — use `evaluate` for protocol-agnostic policy execution
- **Edge platforms**: Cloudflare Workers (primary), Fastly Compute, Vercel Edge Functions, AWS Lambda@Edge

## Documentation

### 11. Versioned Documentation via R2

**Problem:** Every docs deploy overwrites the previous version. Users on older releases can't reference docs matching their version.

**Solution:** Archive each release's docs build in Cloudflare R2, served by a thin routing worker alongside the latest docs via Workers Assets.

**Architecture:**
- **Hybrid Assets + R2**: Latest docs served via Workers Assets (fastest path), versioned archives from R2
- **HTMLRewriter** rewrites absolute paths in versioned HTML to stay within the version prefix (e.g., `/getting-started/` → `/v/0.1.0/getting-started/`). Zero-copy streaming rewriter built into Workers runtime
- **Version banner** injected on non-latest pages via HTMLRewriter `body` handler, using Starlight CSS custom properties for theme consistency

**Routing:**
```
/                    → env.ASSETS.fetch() (latest)
/v/0.1.0-rc.0/*     → R2 v/0.1.0-rc.0/* (with HTMLRewriter)
/api/versions        → R2 versions.json manifest
```

**R2 layout:**
```
stoma-docs/
  versions.json                    # {"latest":"0.1.0","versions":[...]}
  v/0.1.0-rc.0/index.html
  v/0.1.0-rc.0/_astro/...
  v/0.1.0/index.html
  ...
```

**Release flow** (automated via CI):
1. Build docs → `docs/dist/`
2. If changesets published: upload `dist/` to R2 at `v/{version}/`, update `versions.json` (pre-releases don't move the `latest` pointer)
3. `wrangler deploy` pushes worker + static assets (latest)

**Changes required:**

| File | Action |
|------|--------|
| `docs/src/worker.ts` | Create — routing worker (~150 lines) with R2 serving, HTMLRewriter, `/api/versions` endpoint |
| `docs/wrangler.jsonc` | Edit — add `main: "src/worker.ts"`, `assets.binding: "ASSETS"`, `r2_buckets` binding |
| `docs/scripts/upload-versioned-docs.sh` | Create — iterates `dist/`, uploads to R2 with content-type, updates `versions.json` via `jq` |
| `.github/workflows/release.yml` | Edit — add version extraction + R2 archive step before wrangler deploy |

**Worker `Env` interface:**
```typescript
interface Env {
  ASSETS: Fetcher;
  DOCS_BUCKET: R2Bucket;
}
```

**HTMLRewriter selectors** (for versioned pages):
- `a[href]`, `link[href^="/"]`, `script[src^="/"]`, `img[src^="/"]`, `source[src^"/"]`, `source[srcset]`, `form[action^="/"]`
- `astro-island[component-url]`, `astro-island[renderer-url]` (Astro hydration islands)

**One-time setup:** `cd docs && npx wrangler r2 bucket create stoma-docs`

**Verification:**
1. `cd docs && npx wrangler dev` — confirm `/` serves latest through custom worker
2. Upload test version: `bash docs/scripts/upload-versioned-docs.sh 0.0.1-test`
3. Hit `/v/0.0.1-test/` — verify links stay in version prefix, banner appears
4. Hit `/api/versions` — verify manifest JSON
5. DevTools Network tab — all `_astro/` assets load from `/v/.../_astro/`
