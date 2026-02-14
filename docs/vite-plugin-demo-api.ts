/**
 * Vite plugin that serves the Stoma demo API during `astro dev`.
 *
 * Intercepts `/demo-api/*` requests and delegates them to the Stoma
 * gateway's Hono app via `.fetch()`. This means `astro dev` behaves
 * identically to the deployed Cloudflare Worker — no separate
 * wrangler process needed.
 */
import type { Plugin } from "vite";

export default function demoApiPlugin(): Plugin {
  return {
    name: "stoma-demo-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/demo-api")) return next();

        // Lazy-import so the gateway module is resolved through Vite's
        // module graph (enabling HMR and proper TS compilation).
        const { gateway } = await server.ssrLoadModule(
          "./src/demo-api/gateway.ts",
        );

        // Build a Web Request from the Node.js IncomingMessage.
        const protocol = req.headers["x-forwarded-proto"] ?? "http";
        const host = req.headers.host ?? "localhost";
        const url = `${protocol}://${host}${req.url}`;

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }

        const hasBody = req.method !== "GET" && req.method !== "HEAD";
        const body = hasBody
          ? await new Promise<Buffer>((resolve) => {
              const chunks: Buffer[] = [];
              req.on("data", (chunk: Buffer) => chunks.push(chunk));
              req.on("end", () => resolve(Buffer.concat(chunks)));
            })
          : undefined;

        const webRequest = new Request(url, {
          method: req.method,
          headers,
          body,
          // @ts-expect-error -- Node 22 supports duplex on Request
          duplex: hasBody ? "half" : undefined,
        });

        const webResponse = await gateway.app.fetch(webRequest);

        // Write the Web Response back to Node's ServerResponse.
        res.statusCode = webResponse.status;
        webResponse.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });

        const arrayBuffer = await webResponse.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));
      });
    },
  };
}
