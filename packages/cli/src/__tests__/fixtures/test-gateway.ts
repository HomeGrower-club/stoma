import { createGateway, health } from "@vivero/stoma";
import { memoryAdapter } from "@vivero/stoma/adapters";

export default createGateway({
  name: "test-ts-gateway",
  adapter: memoryAdapter(),
  routes: [
    health({ path: "/health" }),
    {
      path: "/echo",
      methods: ["GET"],
      pipeline: {
        upstream: {
          type: "handler",
          handler: (c) => c.json({ ok: true }),
        },
      },
    },
  ],
});
