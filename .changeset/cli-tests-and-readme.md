---
"@vivero/stoma": patch
"@vivero/stoma-cli": patch
---

Add CLI test coverage and split monorepo/package READMEs

### CLI tests

Add 26 tests across 3 files covering the playground wrapper, OAuth relay, gateway resolution security boundary, and TypeScript transpilation end-to-end:

- **Playground routing invariants**: `/__playground` returns HTML, `/registry` returns exact JSON, non-playground paths always pass through to the gateway
- **Send proxy contract**: response shape (`status`, `statusText`, `headers`, `body`, `elapsed`), header forwarding, error handling, body stripping for GET
- **OAuth relay**: interception only fires for navigation requests to callback routes with query params; XSS prevention via `<` escaping
- **Security boundary**: remote URLs without `--trust-remote` always reject with security warning
- **TS transpilation e2e**: loads real `.ts` fixture through esbuild, verifies the gateway's fetch handler produces correct responses

### README

- Root README is now a monorepo landing page with package table, quick start, and dev/release instructions
- Gateway package (`packages/gateway`) retains the full library README for npm
