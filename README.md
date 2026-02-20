# Stoma

Declarative API gateway as a TypeScript library. Runs on Cloudflare Workers, Node.js, Deno, Bun, and any JavaScript runtime.

[Documentation](https://stoma.vivero.dev) | [Architecture](ARCHITECTURE.md)

## Packages

| Package | npm | Description |
|---|---|---|
| [`packages/gateway`](packages/gateway) | [`@vivero/stoma`](https://www.npmjs.com/package/@vivero/stoma) | Gateway library — route/pipeline/policy chain model built on Hono |
| [`packages/cli`](packages/cli) | [`@vivero/stoma-cli`](https://www.npmjs.com/package/@vivero/stoma-cli) | CLI for running gateways locally with TypeScript transpilation and interactive playground |
| [`packages/core`](packages/core) | [`@vivero/stoma-core`](https://www.npmjs.com/package/@vivero/stoma-core) | Shared utilities — debug logging, timing helpers, type guards |
| [`packages/analytics`](packages/analytics) | `@vivero/stoma-analytics` | Structured metric logging, NDJSON-to-Parquet processing, DuckDB querying |
| [`docs/`](docs) | — | Documentation site (Astro + Starlight) |

## Quick Start

```sh
npm install @vivero/stoma hono
```

```typescript
import { createGateway, jwtAuth, rateLimit, cors } from "@vivero/stoma";

export default createGateway({
  name: "my-api",
  policies: [cors()],
  routes: [
    {
      path: "/users/*",
      pipeline: {
        policies: [
          jwtAuth({ secret: "your-secret" }),
          rateLimit({ max: 100, windowSeconds: 60 }),
        ],
        upstream: { type: "url", target: "https://users-api.internal" },
      },
    },
  ],
}).app;
```

Or run any gateway file locally with the CLI:

```sh
npx @vivero/stoma-cli run ./gateway.ts --playground
```

## Development

```sh
yarn install          # install all workspace dependencies
yarn build            # build all packages (Turborepo is not used — runs sequentially)
yarn test             # test all packages
yarn typecheck        # type-check all packages
yarn lint             # lint with Biome
```

Individual packages:

```sh
cd packages/gateway && yarn test        # gateway tests (vitest + workerd pool)
cd packages/cli && yarn test            # CLI tests (vitest, Node)
cd packages/analytics && yarn test      # analytics tests
cd docs && yarn dev                     # docs site dev server
```

Workspace consumers resolve source TypeScript directly — no build step needed during development. The `yarn build` scripts (tsup) compile to `dist/` for npm publishing only.

## Releasing

Versioning and publishing use [Changesets](https://github.com/changesets/changesets):

```sh
yarn changeset            # create a changeset
yarn changeset:version    # bump versions from pending changesets
yarn changeset:publish    # publish to npm
```

## License

MIT
