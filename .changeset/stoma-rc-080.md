---
"@vivero/stoma": patch
"@vivero/stoma-cli": patch
"@vivero/stoma-core": patch
---

### @vivero/stoma

**Exports & TypeDoc**

- Export missing config types from the barrel: `MockConfig`, `ProxyPolicyConfig`, `ApiKeyAuthConfig`, `BasicAuthConfig`, `CorsConfig`, `RegexPatternRule`, `ValidationResult`, `ExtractClientIpOptions`, and `RequiredKeys`
- Export `ValidationResult` interface from the `request-validation` policy (was internal-only)
- Export `RequiredKeys` utility type from the SDK (marked `@internal`)
- Add `tsdoc.json` so TypeDoc recognises `@security` and `@module` block tags without warnings
- Fix broken `{@link Response}` reference in `errorToResponse` JSDoc (changed to inline code)
- Fix `{@link noopDebugLogger}` reference in `policyDebug` JSDoc (changed to prose)
- Update `README.md` architecture link from local `ARCHITECTURE.md` to the docs site

**Examples**

- Fix all upstream targets to use the correct origin (`https://stoma.vivero.dev`) with explicit `rewritePath` functions — previously some examples pointed at a non-existent `/demo-api` path on the upstream
- Rework `basic/gateway.ts` to use a catch-all `/*` route with better inline documentation and playground-friendly paths
- Fix `route-scopes` example: rename `/projects/*` to `/products/*` to match the demo API
- Fix `shadow-release` example: add `rewritePath` for the primary upstream
- Fix `cache-resilience` and `webhook-firewall` examples with correct path rewrites
- Add biome suppression comments for legitimate `any` usage in the `cloudflare-worker` browser rendering example (no DOM lib available in the Workers TS config)

**Lint & Types**

- Suppress `noBannedTypes` lint warning on the `RequiredKeys` utility type (`{}` is intentional for optional-key detection)
- Suppress `noExplicitAny` in the merge config test (stub adapter in test)
- Bump wrangler dev dependency from `^4.65.0` to `^4.68.0`

### @vivero/stoma-cli

- Reformat test assertions in `resolve-security.test.ts` and `wrap.test.ts` for consistency

### Docs site

- Add `llms.txt` support with four endpoints: `/llms.txt` (index with section links), `/llms-full.txt` (complete docs), `/llms-small.txt` (abridged, no API reference), and `/llms/{section}.txt` (10 per-section pages)
- Add `robots.txt` with sitemap reference
- Restore the Node.js deployment guide (`deploy/node/index.mdx`) that went missing
- Fix OG image meta tags to use absolute URLs instead of relative paths
- Add `og:image:type` meta tag
- Fill in `site.webmanifest` name fields (`Stoma — Declarative API Gateway`)
- Move Monaco editor TS compiler config to `beforeMount` so diagnostics are correct on first load
- Suppress top-level await false-positive diagnostics (TS 1375 & 1378) in the playground editor
- Register `@security` as a custom TypeDoc block tag in `astro.config.mjs`
