#!/usr/bin/env node

/**
 * Prepare package.json for `npm publish` by:
 *   1. Resolving `workspace:*` / `workspace:^` / `workspace:~` protocols
 *   2. Applying `publishConfig` field overrides (main, types, exports, bin, etc.)
 *
 * Usage (from a package directory):
 *   node ../../scripts/prepare-publish.mjs          # resolve + apply overrides
 *   node ../../scripts/prepare-publish.mjs --restore # restore backup
 *
 * npm lifecycle integration (in each publishable package.json):
 *   "prepack": "node ../../scripts/resolve-workspace-deps.mjs",
 *   "postpack": "node ../../scripts/resolve-workspace-deps.mjs --restore"
 *
 * Why: `npm publish` (used by @changesets/cli) does not understand Yarn's
 * `workspace:*` protocol, nor does it apply `publishConfig` field overrides
 * (main, types, exports, bin — that's a Yarn-only feature).
 * `yarn npm publish` handles both, but cannot use GitHub Actions OIDC
 * id-tokens for npm auth + provenance. This script bridges the gap.
 */

import { readFileSync, writeFileSync, copyFileSync, unlinkSync, existsSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKUP_SUFFIX = ".workspace-backup";

const pkgPath = join(process.cwd(), "package.json");
const backupPath = pkgPath + BACKUP_SUFFIX;

// --restore mode: put the original back
if (process.argv.includes("--restore")) {
  if (existsSync(backupPath)) {
    copyFileSync(backupPath, pkgPath);
    unlinkSync(backupPath);
    console.log("[prepare-publish] Restored original package.json");
  }
  process.exit(0);
}

// ── Build a map of workspace package names → versions ────────────────────────

const rootDir = resolve(__dirname, "..");
const rootPkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));
const workspaceGlobs = rootPkg.workspaces ?? [];

/** @type {Map<string, string>} */
const workspaceVersions = new Map();

for (const glob of workspaceGlobs) {
  if (glob.includes("*")) {
    const base = glob.replace(/\/?\*$/, "");
    const baseDir = join(rootDir, base);
    if (!existsSync(baseDir)) continue;

    for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const candidate = join(baseDir, entry.name, "package.json");
      if (existsSync(candidate)) {
        const wp = JSON.parse(readFileSync(candidate, "utf-8"));
        if (wp.name && wp.version) {
          workspaceVersions.set(wp.name, wp.version);
        }
      }
    }
  } else {
    const candidate = join(rootDir, glob, "package.json");
    if (existsSync(candidate)) {
      const wp = JSON.parse(readFileSync(candidate, "utf-8"));
      if (wp.name && wp.version) {
        workspaceVersions.set(wp.name, wp.version);
      }
    }
  }
}

// ── Read package.json ────────────────────────────────────────────────────────

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const changes = [];

// ── 1. Resolve workspace protocols ───────────────────────────────────────────

/**
 * @param {string} protocol
 * @param {string} version
 * @returns {string}
 */
function resolveProtocol(protocol, version) {
  if (protocol === "workspace:*") return version;
  if (protocol === "workspace:^") return `^${version}`;
  if (protocol === "workspace:~") return `~${version}`;
  return protocol.replace("workspace:", "");
}

for (const depField of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
  const deps = pkg[depField];
  if (!deps) continue;

  for (const [name, spec] of Object.entries(deps)) {
    if (typeof spec === "string" && spec.startsWith("workspace:")) {
      const realVersion = workspaceVersions.get(name);
      if (!realVersion) {
        console.error(`[prepare-publish] Could not find workspace version for "${name}"`);
        process.exit(1);
      }
      deps[name] = resolveProtocol(spec, realVersion);
      changes.push(`  workspace: ${name} → ${deps[name]}`);
    }
  }
}

// ── 2. Apply publishConfig field overrides ───────────────────────────────────
// npm only uses publishConfig for access/registry/tag. Yarn also applies
// overrides for main, module, types, exports, bin, etc. Replicate that here.

const PUBLISH_CONFIG_FIELDS = [
  "main", "module", "types", "typings", "bin", "exports", "browser",
];

if (pkg.publishConfig) {
  for (const field of PUBLISH_CONFIG_FIELDS) {
    if (field in pkg.publishConfig) {
      pkg[field] = pkg.publishConfig[field];
      changes.push(`  publishConfig: ${field} overridden`);
    }
  }
}

// ── Write ────────────────────────────────────────────────────────────────────

if (changes.length === 0) {
  console.log("[prepare-publish] Nothing to do.");
  process.exit(0);
}

copyFileSync(pkgPath, backupPath);
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");

console.log("[prepare-publish] Prepared package.json for publish:");
for (const c of changes) console.log(c);
