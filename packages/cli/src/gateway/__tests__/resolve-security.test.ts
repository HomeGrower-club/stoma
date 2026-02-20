import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { resolveGateway } from "../resolve.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, "../../__tests__/fixtures");

describe("resolveGateway security boundaries", () => {
  // ── Remote URL security gate ──────────────────────────────────

  describe("remote URL without --trust-remote", () => {
    it("always rejects http:// URLs", async () => {
      await expect(
        resolveGateway("http://evil.com/gateway.ts")
      ).rejects.toThrow("--trust-remote");
    });

    it("always rejects https:// URLs", async () => {
      await expect(
        resolveGateway("https://evil.com/gateway.ts")
      ).rejects.toThrow("--trust-remote");
    });

    it("includes the security warning in the error message", async () => {
      await expect(
        resolveGateway("https://example.com/gw.ts")
      ).rejects.toThrow("download and execute code");
    });
  });

  // ── File not found ────────────────────────────────────────────

  describe("missing local files", () => {
    it("throws with 'File not found' for non-existent paths", async () => {
      await expect(
        resolveGateway("/tmp/definitely-does-not-exist-gateway.ts")
      ).rejects.toThrow("File not found");
    });
  });

  // ── TypeScript transpilation end-to-end ───────────────────────

  describe("TypeScript gateway loading", () => {
    it("loads and transpiles a real .ts gateway file", async () => {
      const fixturePath = path.join(fixturesDir, "test-gateway.ts");
      const gw = await resolveGateway(fixturePath);

      expect(gw.name).toBe("test-ts-gateway");
      expect(gw.routeCount).toBeGreaterThan(0);
      expect(gw._registry).toBeDefined();
      expect(gw._registry.routes.length).toBeGreaterThan(0);
    });

    it("produces a gateway with a working fetch handler", async () => {
      const fixturePath = path.join(fixturesDir, "test-gateway.ts");
      const gw = await resolveGateway(fixturePath);

      const res = await gw.app.fetch(
        new Request("http://localhost/health")
      );
      expect(res.status).toBe(200);
    });

    it("routes defined in the TS file are functional", async () => {
      const fixturePath = path.join(fixturesDir, "test-gateway.ts");
      const gw = await resolveGateway(fixturePath);

      const res = await gw.app.fetch(
        new Request("http://localhost/echo")
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({ ok: true });
    });
  });
});
