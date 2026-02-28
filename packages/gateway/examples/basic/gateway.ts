// Minimal gateway example — the simplest possible Stoma configuration.
// Creates a gateway that proxies requests to the Stoma Demo API with
// request logging and CORS enabled globally.
//
// Run it:
//   stoma run gateway.ts --playground
//
// Try these paths in the playground:
//   GET /api/users        → list users
//   GET /api/products     → list products
//   GET /api/echo         → echo request details
//   GET /api/status/418   → I'm a teapot
//
// Demo API: https://stoma.vivero.dev/demo-api

import { cors, createGateway, requestLog } from "@vivero/stoma";

const gateway = createGateway({
  // Friendly identifier shown in logs, admin UI, and metrics
  name: "my-gateway",

  // Prefix added to all route paths — requests to /api/users
  // will match the catch-all route below
  basePath: "/api",

  // Global policies run on every request before route-specific policies
  policies: [requestLog(), cors()],

  routes: [
    {
      // Catch-all wildcard — proxies any path under /api/ to the demo API
      path: "/*",

      pipeline: {
        // Route-specific policies (in addition to global)
        policies: [],

        // Upstream: where to send the request after policies pass
        upstream: {
          type: "url",
          target: "https://stoma.vivero.dev",
          // Map /api/... → /demo-api/... on the upstream server
          rewritePath: (path) => path.replace("/api", "/demo-api"),
        },
      },
    },
  ],
});

export default gateway;
