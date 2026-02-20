---
"@vivero/stoma-cli": patch
"@vivero/stoma": patch
"@vivero/stoma-core": patch
---

Fix npm publish pipeline to correctly resolve workspace protocols and apply publishConfig overrides

Adds prepack/postpack lifecycle scripts that prepare package.json for `npm publish` by resolving `workspace:*` to real versions and applying `publishConfig` field overrides (main, types, exports, bin). This replaces the previous `@changesets/cli` yarn patch approach and restores compatibility with GitHub Actions OIDC tokens for npm authentication and provenance.
