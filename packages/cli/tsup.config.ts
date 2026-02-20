import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bin.ts"],
  format: ["esm"],
  bundle: true,
  target: "node20",
  platform: "node",
  banner: { js: "#!/usr/bin/env node" },
  external: [
    "@vivero/stoma",
    "@vivero/stoma/*",
    "hono",
    "hono/*",
    "zod",
    "esbuild",
  ],
  dts: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  tsconfig: "tsconfig.build.json",
});
