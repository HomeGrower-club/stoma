# @vivero/stoma-cli

CLI for running [Stoma](https://stoma.vivero.dev) API gateways locally. Load a gateway file (TypeScript or JavaScript, local or remote) and serve it on a Node.js HTTP server with an optional interactive playground.

## Installation

```sh
npm install -g @vivero/stoma-cli
# or use directly with npx
npx @vivero/stoma-cli run ./my-gateway.ts
```

The CLI requires `@vivero/stoma` and `hono` as peer dependencies. Both are included when you install the CLI as a project dependency alongside the gateway library.

## Quick Start

Given a gateway file:

```typescript
// gateway.ts
import { createGateway, health } from "@vivero/stoma";
import { memoryAdapter } from "@vivero/stoma/adapters";

export default createGateway({
  name: "my-api",
  adapter: memoryAdapter(),
  routes: [
    health({ path: "/health" }),
    {
      path: "/hello",
      methods: ["GET"],
      pipeline: {
        upstream: {
          type: "handler",
          handler: (c) => c.json({ message: "Hello from Stoma" }),
        },
      },
    },
  ],
});
```

Run it:

```sh
stoma run ./gateway.ts
# Gateway "my-api" listening on http://localhost:8787
#   GET      /health
#   GET      /hello
```

## Commands

### `stoma run <file> [options]`

Start a local HTTP server for a Stoma gateway file.

| Option | Alias | Default | Description |
|---|---|---|---|
| `--port` | `-p` | `8787` | Port to listen on |
| `--host` | `-H` | `localhost` | Hostname to bind to |
| `--debug` | `-d` | `false` | Enable gateway debug logging |
| `--verbose` | `-v` | `false` | Verbose CLI output (prints route table on load) |
| `--playground` | | `false` | Serve interactive playground UI at `/__playground` |
| `--trust-remote` | | `false` | Allow loading gateway files from remote URLs |

#### Examples

```sh
# Run on a custom port
stoma run ./gateway.ts --port 3000

# Run with debug logging enabled
stoma run ./gateway.ts --debug

# Run with the interactive playground
stoma run ./gateway.ts --playground

# Run a remote gateway file
stoma run https://example.com/gateway.ts --trust-remote
```

### `stoma --help`

Print available commands and global options.

### `stoma --version`

Print the CLI version.

## Gateway File Resolution

The CLI accepts any file that exports a gateway in one of these forms (checked in order):

1. **Named export `createPlaygroundGateway()`** — called as an async factory
2. **Default export function** — called as an async factory, must return a gateway
3. **Default export object** with `.app` and `._registry` — used directly as a `GatewayInstance`
4. **Default export object** with `.fetch` — treated as a bare Hono app, wrapped in a minimal gateway instance

TypeScript files (`.ts`, `.tsx`, `.mts`) are automatically bundled with esbuild before importing. The CLI provides its own `@vivero/stoma` and `hono` packages via `nodePaths`, so gateway files work without a local `node_modules` — you can run a standalone `.ts` file from anywhere (e.g. `~/Downloads/`).

## Remote Gateway Files

The CLI can fetch and run gateway files from URLs:

```sh
stoma run https://raw.githubusercontent.com/user/repo/main/gateway.ts --trust-remote
```

The `--trust-remote` flag is required because this downloads and executes arbitrary code. Only use it with sources you trust.

The file extension is inferred from the URL path. If the URL has no recognisable extension, the CLI falls back to the response `content-type` header, and ultimately defaults to `.ts` (esbuild can transpile both TypeScript and plain JavaScript).

The fetched file is written to a temporary directory, resolved through the normal pipeline, and cleaned up after loading.

## Playground

When `--playground` is passed, the CLI serves an interactive UI at `/__playground` that lets you:

- Browse all registered routes and their policies
- Send requests to any route and inspect the full response (status, headers, body, timing)
- Test OAuth flows — callback routes are intercepted with a relay page that sends parameters back to the playground via `postMessage`

The playground makes requests server-side (bypassing browser CORS/redirect limitations), so you get accurate response details including redirect responses and custom headers.

Playground routes:

| Path | Purpose |
|---|---|
| `/__playground` | Interactive UI |
| `/__playground/registry` | Gateway registry as JSON |
| `/__playground/send` | Server-side request proxy (POST) |

## Graceful Shutdown

Press `Ctrl+C` to shut down. The CLI:

1. Stops accepting new connections
2. Destroys all active connections
3. Waits for the server to close (up to 3 seconds)
4. Force-exits if graceful shutdown stalls

Pressing `Ctrl+C` a second time force-exits immediately.

## Development

```sh
# Run from source (no build needed)
yarn dev run ./path/to/gateway.ts

# Build for publishing
yarn build

# Run tests
yarn test

# Type-check
yarn typecheck
```

The package exports raw TypeScript source during development — workspace consumers resolve it directly via the `exports` field. The `yarn build` script (tsup) compiles to `dist/` for npm publishing only.

## Architecture

```
src/
├── bin.ts              # Entry point — invokes the CLI
├── cli.ts              # Clipanion CLI setup (registers commands)
├── commands/
│   ├── index.ts        # Command re-exports
│   └── run.ts          # `stoma run` command
├── gateway/
│   ├── resolve.ts      # Gateway loading: TS transpilation, remote fetch, export resolution
│   └── types.ts        # GatewayInstance, GatewayRegistry types
├── server/
│   └── serve.ts        # @hono/node-server wrapper
├── playground/
│   ├── wrap.ts         # Wraps gateway fetch with playground routes
│   ├── html.ts         # Playground UI (self-contained HTML/CSS/JS)
│   └── oauth-relay.ts  # OAuth callback relay page
└── utils/
    ├── logger.ts       # Simple console logger with verbose mode
    └── version.ts      # Reads version from package.json
```

## License

MIT
