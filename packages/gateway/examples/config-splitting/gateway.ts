// Configuration splitting: organize a large gateway config across
// multiple files using mergeConfigs(). Each team owns their routes
// in a separate module; the entrypoint composes them together.

import type { GatewayConfig } from "@vivero/stoma";
import {
  cors,
  createGateway,
  health,
  rateLimit,
  requestLog,
} from "@vivero/stoma";
import { mergeConfigs } from "@vivero/stoma/config";
import { apiRoutes } from "./routes/api";
import { authRoutes } from "./routes/auth";

// Shared base config — gateway-wide settings
const baseConfig: Partial<GatewayConfig> = {
  name: "platform-api",
  basePath: "/api",
  policies: [
    cors({ origins: ["https://app.example.com"] }),
    requestLog(),
    rateLimit({ max: 500, windowSeconds: 60 }),
  ],
};

// Compose all configs together
const gateway = createGateway(
  mergeConfigs(
    baseConfig,
    { routes: [health({ path: "/health" })] },
    authRoutes,
    apiRoutes
  )
);

export default gateway;
