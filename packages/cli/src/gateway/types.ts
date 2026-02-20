/** Mirrors GatewayInstance from @vivero/stoma — defined locally to avoid import-time dependency. */
export interface GatewayInstance {
  app: { fetch: (request: Request) => Response | Promise<Response> };
  routeCount: number;
  name: string;
  _registry: GatewayRegistry;
}

export interface GatewayRegistry {
  routes: RegisteredRoute[];
  policies: RegisteredPolicy[];
  gatewayName: string;
}

export interface RegisteredRoute {
  path: string;
  methods: string[];
  policies: string[];
}

export interface RegisteredPolicy {
  name: string;
  priority: number;
}
