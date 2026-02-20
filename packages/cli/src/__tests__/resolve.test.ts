import { describe, expect, it } from "vitest";
import { resolveFromModule } from "../gateway/resolve.js";
import type { GatewayInstance } from "../gateway/types.js";

function mockGateway(
  overrides: Partial<GatewayInstance> = {}
): GatewayInstance {
  return {
    app: { fetch: () => new Response("ok") },
    name: "test-gateway",
    routeCount: 2,
    _registry: {
      routes: [],
      policies: [],
      gatewayName: "test-gateway",
    },
    ...overrides,
  };
}

describe("resolveFromModule", () => {
  it("resolves a default GatewayInstance export", async () => {
    const gw = mockGateway();
    const result = await resolveFromModule({ default: gw });
    expect(result).toBe(gw);
  });

  it("resolves a default sync factory function", async () => {
    const gw = mockGateway();
    const result = await resolveFromModule({ default: () => gw });
    expect(result.name).toBe("test-gateway");
  });

  it("resolves a default async factory function", async () => {
    const gw = mockGateway({ name: "async-gw" });
    const result = await resolveFromModule({
      default: async () => gw,
    });
    expect(result.name).toBe("async-gw");
  });

  it("resolves createPlaygroundGateway named export", async () => {
    const gw = mockGateway({ name: "playground" });
    const result = await resolveFromModule({
      createPlaygroundGateway: () => gw,
    });
    expect(result.name).toBe("playground");
  });

  it("prefers createPlaygroundGateway over default", async () => {
    const pgGw = mockGateway({ name: "playground" });
    const defGw = mockGateway({ name: "default" });
    const result = await resolveFromModule({
      createPlaygroundGateway: () => pgGw,
      default: defGw,
    });
    expect(result.name).toBe("playground");
  });

  it("resolves a bare Hono app with .fetch", async () => {
    const app = { fetch: () => new Response("bare") };
    const result = await resolveFromModule({ default: app });
    expect(result.name).toBe("unnamed-gateway");
    expect(result.app).toBe(app);
    expect(result.routeCount).toBe(0);
  });

  it("throws for invalid exports", async () => {
    await expect(
      resolveFromModule({ default: "not-a-gateway" })
    ).rejects.toThrow("Could not resolve a gateway");
  });

  it("throws for empty module", async () => {
    await expect(resolveFromModule({})).rejects.toThrow(
      "Could not resolve a gateway"
    );
  });

  it("throws when factory returns invalid value", async () => {
    await expect(
      resolveFromModule({ default: () => "invalid" })
    ).rejects.toThrow("did not return a valid gateway instance");
  });
});
