---
"@vivero/stoma-cli": patch
"@vivero/stoma": patch
"@vivero/stoma-core": patch
---

fix: publish via `yarn npm publish` to correctly resolve `workspace:*` protocols

Replaces `changeset publish` (which used `npm publish <dir>` and never resolved workspace protocols) with a custom publish script that runs `yarn npm publish` from each package directory. Yarn natively handles `workspace:*` resolution and `publishConfig` field overrides, so the prepack/postpack workaround scripts have been removed.
