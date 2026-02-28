import path from "node:path";
import { Command, Option } from "clipanion";
import { resolveGateway } from "../gateway/resolve.js";
import type { GatewayInstance } from "../gateway/types.js";
import { wrapWithPlayground } from "../playground/wrap.js";
import { startServer } from "../server/serve.js";
import { createLogger } from "../utils/logger.js";

export class RunCommand extends Command {
  static override paths = [["run"]];

  static override usage = Command.Usage({
    description: "Start a local HTTP server for a Stoma gateway file",
    details: `
      Loads a compiled gateway JS file (or TypeScript with tsx) and serves it
      on a local Node.js HTTP server.

      The file must export a gateway instance, a factory function, or a
      \`createPlaygroundGateway\` named export.
    `,
    examples: [
      ["Run a compiled gateway file", "stoma run ./my-gateway.js"],
      ["Run on a custom port", "stoma run ./my-gateway.js --port 3000"],
      ["Run with debug logging", "stoma run ./my-gateway.js --debug"],
      [
        "Run a remote gateway file",
        "stoma run https://example.com/gateway.ts --trust-remote",
      ],
    ],
  });

  file = Option.String({ required: true });

  port = Option.String("--port,-p", "8787", {
    description: "Port to listen on (default: 8787)",
  });

  host = Option.String("--host,-H", "localhost", {
    description: "Hostname to bind to (default: localhost)",
  });

  debug = Option.Boolean("--debug,-d", false, {
    description: "Enable gateway debug logging",
  });

  verbose = Option.Boolean("--verbose,-v", false, {
    description: "Verbose CLI output",
  });

  playground = Option.Boolean("--playground", false, {
    description: "Serve interactive playground UI at /__playground",
  });

  trustRemote = Option.Boolean("--trust-remote", false, {
    description:
      "Allow loading gateway files from remote URLs (downloads and executes code — use only with trusted sources)",
  });

  async execute() {
    const log = createLogger(this.verbose);
    const isRemote =
      this.file.startsWith("http://") || this.file.startsWith("https://");
    const filePath = isRemote ? this.file : path.resolve(this.file);
    const portNum = parseInt(this.port, 10);

    if (Number.isNaN(portNum) || portNum < 0 || portNum > 65535) {
      log.error(`Invalid port: ${this.port}`);
      return 1;
    }

    log.info(`Loading gateway from ${filePath}`);

    let gateway: GatewayInstance;
    try {
      gateway = await resolveGateway(filePath, {
        debug: this.debug,
        trustRemote: this.trustRemote,
      });
    } catch (err) {
      log.error(
        `Failed to load gateway: ${err instanceof Error ? err.message : String(err)}`
      );
      return 1;
    }

    log.info(
      `Gateway "${gateway.name}" loaded (${gateway.routeCount} route${gateway.routeCount === 1 ? "" : "s"})`
    );

    if (this.verbose && gateway._registry) {
      for (const route of gateway._registry.routes) {
        const methods = Array.isArray(route.methods)
          ? route.methods.join(",")
          : "ALL";
        log.verbose(`  ${methods.padEnd(8)} ${route.path}`);
      }
    }

    try {
      const fetch =
        this.playground && gateway._registry
          ? wrapWithPlayground(gateway.app.fetch, gateway._registry)
          : gateway.app.fetch;

      const server = await startServer({
        fetch,
        port: portNum,
        hostname: this.host,
      });

      log.info(
        `Gateway "${gateway.name}" listening on http://${this.host}:${portNum}`
      );

      if (this.playground) {
        log.info(`Playground: http://${this.host}:${portNum}/__playground`);
      }

      if (gateway._registry) {
        for (const route of gateway._registry.routes) {
          const methods = Array.isArray(route.methods)
            ? route.methods.join(",")
            : "ALL";
          log.info(`  ${methods.padEnd(8)} ${route.path}`);
        }
      }

      await new Promise<void>((resolve) => {
        let shuttingDown = false;

        const shutdown = () => {
          if (shuttingDown) {
            log.info("\nForce exit");
            process.exit(1);
          }
          shuttingDown = true;
          log.info("\nShutting down...");

          // Force exit after 3s if graceful shutdown stalls
          const forceExit = setTimeout(() => {
            log.error("Graceful shutdown timed out, forcing exit");
            process.exit(1);
          }, 3_000);
          forceExit.unref();

          server.closeAllConnections();
          server.close(() => {
            clearTimeout(forceExit);
            resolve();
          });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
      });

      // Clipanion's runExit() only sets process.exitCode — it doesn't
      // call process.exit(). If @hono/node-server leaves lingering handles
      // the event loop never drains and the process hangs.
      return process.exit(0) as never;
    } catch (err) {
      log.error(
        `Server error: ${err instanceof Error ? err.message : String(err)}`
      );
      return 1;
    }
  }
}
