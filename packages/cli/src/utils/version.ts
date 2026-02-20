import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

let cachedVersion: string | undefined;

export function getVersion(): string {
  if (cachedVersion) return cachedVersion;

  try {
    const dir = dirname(fileURLToPath(import.meta.url));
    // Try both: bundled (dist/bin.js → ../package.json) and source (src/utils/version.ts → ../../package.json)
    for (const rel of ["..", "../.."]) {
      const candidate = resolve(dir, rel, "package.json");
      if (existsSync(candidate)) {
        const pkg = JSON.parse(readFileSync(candidate, "utf-8"));
        if (pkg.name === "@vivero/stoma-cli") {
          cachedVersion = (pkg.version as string) ?? "0.0.0";
          return cachedVersion!;
        }
      }
    }
    cachedVersion = "0.0.0";
  } catch {
    cachedVersion = "0.0.0";
  }

  return cachedVersion!;
}
