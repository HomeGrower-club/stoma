// Route scopes: group routes under shared path prefixes and policies
// using scope(). Eliminates repetition when multiple routes share
// the same base path or middleware stack.
// Demo API: https://stoma.vivero.dev/demo-api

import { cors, createGateway, health, jwtAuth, scope } from "@vivero/stoma";

// Scoped routes share a prefix and JWT auth policy
const apiRoutes = scope({
  prefix: "/api/v1",
  policies: [jwtAuth({ secret: "my-jwt-secret" })],
  routes: [
    {
      path: "/users/*",
      pipeline: {
        upstream: {
          type: "url",
          target: "https://stoma.vivero.dev",
          rewritePath: (path) => path.replace("/api/v1", "/demo-api"),
        },
      },
    },
    {
      path: "/products/*",
      pipeline: {
        upstream: {
          type: "url",
          target: "https://stoma.vivero.dev",
          rewritePath: (path) => path.replace("/api/v1", "/demo-api"),
        },
      },
    },
  ],
});

const gateway = createGateway({
  name: "my-api",
  policies: [cors()],
  routes: [
    // Health check lives outside any scope
    health({ path: "/health" }),
    // Scoped routes at /api/v1/users/* and /api/v1/products/*
    ...apiRoutes,
  ],
});

export default gateway;
