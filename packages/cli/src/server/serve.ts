import type { Server } from "node:http";
import { serve } from "@hono/node-server";

export interface StartServerOptions {
  fetch: (request: Request) => Response | Promise<Response>;
  port: number;
  hostname: string;
}

export function startServer(options: StartServerOptions): Promise<Server> {
  const { fetch, port, hostname } = options;

  return new Promise<Server>((resolve, reject) => {
    const server = serve(
      { fetch, port, hostname },
      () => resolve(server as unknown as Server)
    );

    // Handle EADDRINUSE before the callback fires
    (server as unknown as Server).on?.("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        reject(
          new Error(
            `Port ${port} is already in use. Try a different port with --port <number>`
          )
        );
      } else {
        reject(err);
      }
    });
  });
}
