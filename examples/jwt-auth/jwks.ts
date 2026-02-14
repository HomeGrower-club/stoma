// JWT authentication using JWKS (RSA public keys) from an external provider.
// Use this approach when tokens are signed by an identity provider like
// Auth0, Supabase, Firebase, or Okta.

import { createGateway, jwtAuth, cors, requestLog } from "@homegrower-club/stoma";

const gateway = createGateway({
  name: "secure-api",
  basePath: "/api",
  policies: [requestLog(), cors()],
  routes: [
    {
      path: "/users/*",
      pipeline: {
        policies: [
          jwtAuth({
            // Fetch public keys from the provider's JWKS endpoint
            jwksUrl: "https://your-auth0-domain.auth0.com/.well-known/jwks.json",
            // Validate the issuer claim — prevents tokens from other issuers
            issuer: "https://your-auth0-domain.auth0.com/",
            // Validate the audience claim — prevents tokens for other APIs
            audience: "https://api.yourapp.com",
            // Forward claims as upstream headers
            forwardClaims: {
              sub: "x-user-id",
              email: "x-user-email",
            },
            // Cache JWKS for 5 minutes (default) to reduce network calls
            jwksCacheTtlMs: 300000,
          }),
        ],
        upstream: {
          type: "url",
          target: "https://users.internal",
        },
      },
    },
  ],
});

export default gateway;
