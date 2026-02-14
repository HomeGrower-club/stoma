var p = class extends Error {
  statusCode;
  code;
  /** Optional headers to include in the error response (e.g. rate-limit headers) */
  headers;
  constructor(e, r, t, s) {
    super(t), this.name = "GatewayError", this.statusCode = e, this.code = r, this.headers = s;
  }
};
function je(e, r) {
  const t = {
    error: e.code,
    message: e.message,
    statusCode: e.statusCode,
    ...r ? { requestId: r } : {}
  }, s = {
    "content-type": "application/json",
    ...e.headers
  };
  return new Response(JSON.stringify(t), {
    status: e.statusCode,
    headers: s
  });
}
function St(e, r = "An unexpected error occurred") {
  const t = {
    error: "internal_error",
    message: r,
    statusCode: 500,
    ...e ? { requestId: e } : {}
  };
  return new Response(JSON.stringify(t), {
    status: 500,
    headers: { "content-type": "application/json" }
  });
}
var be = (e, r, t) => (s, n) => {
  let a = -1;
  return o(0);
  async function o(i) {
    if (i <= a)
      throw new Error("next() called multiple times");
    a = i;
    let l, c = !1, u;
    if (e[i] ? (u = e[i][0][0], s.req.routeIndex = i) : u = i === e.length && n || void 0, u)
      try {
        l = await u(s, () => o(i + 1));
      } catch (d) {
        if (d instanceof Error && r)
          s.error = d, l = await r(d, s), c = !0;
        else
          throw d;
      }
    else
      s.finalized === !1 && t && (l = await t(s));
    return l && (s.finalized === !1 || c) && (s.res = l), s;
  }
}, vt = /* @__PURE__ */ Symbol(), Tt = async (e, r = /* @__PURE__ */ Object.create(null)) => {
  const { all: t = !1, dot: s = !1 } = r, a = (e instanceof Ke ? e.raw.headers : e.headers).get("Content-Type");
  return a?.startsWith("multipart/form-data") || a?.startsWith("application/x-www-form-urlencoded") ? bt(e, { all: t, dot: s }) : {};
};
async function bt(e, r) {
  const t = await e.formData();
  return t ? xt(t, r) : {};
}
function xt(e, r) {
  const t = /* @__PURE__ */ Object.create(null);
  return e.forEach((s, n) => {
    r.all || n.endsWith("[]") ? Rt(t, n, s) : t[n] = s;
  }), r.dot && Object.entries(t).forEach(([s, n]) => {
    s.includes(".") && (At(t, s, n), delete t[s]);
  }), t;
}
var Rt = (e, r, t) => {
  e[r] !== void 0 ? Array.isArray(e[r]) ? e[r].push(t) : e[r] = [e[r], t] : r.endsWith("[]") ? e[r] = [t] : e[r] = t;
}, At = (e, r, t) => {
  let s = e;
  const n = r.split(".");
  n.forEach((a, o) => {
    o === n.length - 1 ? s[a] = t : ((!s[a] || typeof s[a] != "object" || Array.isArray(s[a]) || s[a] instanceof File) && (s[a] = /* @__PURE__ */ Object.create(null)), s = s[a]);
  });
}, Ne = (e) => {
  const r = e.split("/");
  return r[0] === "" && r.shift(), r;
}, Et = (e) => {
  const { groups: r, path: t } = $t(e), s = Ne(t);
  return _t(s, r);
}, $t = (e) => {
  const r = [];
  return e = e.replace(/\{[^}]+\}/g, (t, s) => {
    const n = `@${s}`;
    return r.push([n, t]), n;
  }), { groups: r, path: e };
}, _t = (e, r) => {
  for (let t = r.length - 1; t >= 0; t--) {
    const [s] = r[t];
    for (let n = e.length - 1; n >= 0; n--)
      if (e[n].includes(s)) {
        e[n] = e[n].replace(s, r[t][1]);
        break;
      }
  }
  return e;
}, V = {}, Ht = (e, r) => {
  if (e === "*")
    return "*";
  const t = e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (t) {
    const s = `${e}#${r}`;
    return V[s] || (t[2] ? V[s] = r && r[0] !== ":" && r[0] !== "*" ? [s, t[1], new RegExp(`^${t[2]}(?=/${r})`)] : [e, t[1], new RegExp(`^${t[2]}$`)] : V[s] = [e, t[1], !0]), V[s];
  }
  return null;
}, ge = (e, r) => {
  try {
    return r(e);
  } catch {
    return e.replace(/(?:%[0-9A-Fa-f]{2})+/g, (t) => {
      try {
        return r(t);
      } catch {
        return t;
      }
    });
  }
}, qt = (e) => ge(e, decodeURI), De = (e) => {
  const r = e.url, t = r.indexOf("/", r.indexOf(":") + 4);
  let s = t;
  for (; s < r.length; s++) {
    const n = r.charCodeAt(s);
    if (n === 37) {
      const a = r.indexOf("?", s), o = r.indexOf("#", s), i = a === -1 ? o === -1 ? void 0 : o : o === -1 ? a : Math.min(a, o), l = r.slice(t, i);
      return qt(l.includes("%25") ? l.replace(/%25/g, "%2525") : l);
    } else if (n === 63 || n === 35)
      break;
  }
  return r.slice(t, s);
}, Ct = (e) => {
  const r = De(e);
  return r.length > 1 && r.at(-1) === "/" ? r.slice(0, -1) : r;
}, N = (e, r, ...t) => (t.length && (r = N(r, ...t)), `${e?.[0] === "/" ? "" : "/"}${e}${r === "/" ? "" : `${e?.at(-1) === "/" ? "" : "/"}${r?.[0] === "/" ? r.slice(1) : r}`}`), Ue = (e) => {
  if (e.charCodeAt(e.length - 1) !== 63 || !e.includes(":"))
    return null;
  const r = e.split("/"), t = [];
  let s = "";
  return r.forEach((n) => {
    if (n !== "" && !/\:/.test(n))
      s += "/" + n;
    else if (/\:/.test(n))
      if (/\?/.test(n)) {
        t.length === 0 && s === "" ? t.push("/") : t.push(s);
        const a = n.replace("?", "");
        s += "/" + a, t.push(s);
      } else
        s += "/" + n;
  }), t.filter((n, a, o) => o.indexOf(n) === a);
}, ne = (e) => /[%+]/.test(e) ? (e.indexOf("+") !== -1 && (e = e.replace(/\+/g, " ")), e.indexOf("%") !== -1 ? ge(e, Be) : e) : e, Le = (e, r, t) => {
  let s;
  if (!t && r && !/[%+]/.test(r)) {
    let o = e.indexOf("?", 8);
    if (o === -1)
      return;
    for (e.startsWith(r, o + 1) || (o = e.indexOf(`&${r}`, o + 1)); o !== -1; ) {
      const i = e.charCodeAt(o + r.length + 1);
      if (i === 61) {
        const l = o + r.length + 2, c = e.indexOf("&", l);
        return ne(e.slice(l, c === -1 ? void 0 : c));
      } else if (i == 38 || isNaN(i))
        return "";
      o = e.indexOf(`&${r}`, o + 1);
    }
    if (s = /[%+]/.test(e), !s)
      return;
  }
  const n = {};
  s ??= /[%+]/.test(e);
  let a = e.indexOf("?", 8);
  for (; a !== -1; ) {
    const o = e.indexOf("&", a + 1);
    let i = e.indexOf("=", a);
    i > o && o !== -1 && (i = -1);
    let l = e.slice(
      a + 1,
      i === -1 ? o === -1 ? void 0 : o : i
    );
    if (s && (l = ne(l)), a = o, l === "")
      continue;
    let c;
    i === -1 ? c = "" : (c = e.slice(i + 1, o === -1 ? void 0 : o), s && (c = ne(c))), t ? (n[l] && Array.isArray(n[l]) || (n[l] = []), n[l].push(c)) : n[l] ??= c;
  }
  return r ? n[r] : n;
}, Mt = Le, It = (e, r) => Le(e, r, !0), Be = decodeURIComponent, xe = (e) => ge(e, Be), Ke = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #t;
  // Short name of validatedData
  #e;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(e, r = "/", t = [[]]) {
    this.raw = e, this.path = r, this.#e = t, this.#t = {};
  }
  param(e) {
    return e ? this.#r(e) : this.#a();
  }
  #r(e) {
    const r = this.#e[0][this.routeIndex][1][e], t = this.#n(r);
    return t && /\%/.test(t) ? xe(t) : t;
  }
  #a() {
    const e = {}, r = Object.keys(this.#e[0][this.routeIndex][1]);
    for (const t of r) {
      const s = this.#n(this.#e[0][this.routeIndex][1][t]);
      s !== void 0 && (e[t] = /\%/.test(s) ? xe(s) : s);
    }
    return e;
  }
  #n(e) {
    return this.#e[1] ? this.#e[1][e] : e;
  }
  query(e) {
    return Mt(this.url, e);
  }
  queries(e) {
    return It(this.url, e);
  }
  header(e) {
    if (e)
      return this.raw.headers.get(e) ?? void 0;
    const r = {};
    return this.raw.headers.forEach((t, s) => {
      r[s] = t;
    }), r;
  }
  async parseBody(e) {
    return this.bodyCache.parsedBody ??= await Tt(this, e);
  }
  #s = (e) => {
    const { bodyCache: r, raw: t } = this, s = r[e];
    if (s)
      return s;
    const n = Object.keys(r)[0];
    return n ? r[n].then((a) => (n === "json" && (a = JSON.stringify(a)), new Response(a)[e]())) : r[e] = t[e]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#s("text").then((e) => JSON.parse(e));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#s("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#s("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#s("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#s("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(e, r) {
    this.#t[e] = r;
  }
  valid(e) {
    return this.#t[e];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [vt]() {
    return this.#e;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#e[0].map(([[, e]]) => e);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#e[0].map(([[, e]]) => e)[this.routeIndex].path;
  }
}, Ot = {
  Stringify: 1
}, Fe = async (e, r, t, s, n) => {
  typeof e == "object" && !(e instanceof String) && (e instanceof Promise || (e = e.toString()), e instanceof Promise && (e = await e));
  const a = e.callbacks;
  return a?.length ? (n ? n[0] += e : n = [e], Promise.all(a.map((i) => i({ phase: r, buffer: n, context: s }))).then(
    (i) => Promise.all(
      i.filter(Boolean).map((l) => Fe(l, r, !1, s, n))
    ).then(() => n[0])
  )) : Promise.resolve(e);
}, kt = "text/plain; charset=UTF-8", ae = (e, r) => ({
  "Content-Type": e,
  ...r
}), Pt = class {
  #t;
  #e;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #r;
  finalized = !1;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #a;
  #n;
  #s;
  #u;
  #l;
  #c;
  #i;
  #d;
  #h;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(e, r) {
    this.#t = e, r && (this.#n = r.executionCtx, this.env = r.env, this.#c = r.notFoundHandler, this.#h = r.path, this.#d = r.matchResult);
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    return this.#e ??= new Ke(this.#t, this.#h, this.#d), this.#e;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#n && "respondWith" in this.#n)
      return this.#n;
    throw Error("This context has no FetchEvent");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#n)
      return this.#n;
    throw Error("This context has no ExecutionContext");
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#s ||= new Response(null, {
      headers: this.#i ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(e) {
    if (this.#s && e) {
      e = new Response(e.body, e);
      for (const [r, t] of this.#s.headers.entries())
        if (r !== "content-type")
          if (r === "set-cookie") {
            const s = this.#s.headers.getSetCookie();
            e.headers.delete("set-cookie");
            for (const n of s)
              e.headers.append("set-cookie", n);
          } else
            e.headers.set(r, t);
    }
    this.#s = e, this.finalized = !0;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...e) => (this.#l ??= (r) => this.html(r), this.#l(...e));
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (e) => this.#u = e;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#u;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (e) => {
    this.#l = e;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (e, r, t) => {
    this.finalized && (this.#s = new Response(this.#s.body, this.#s));
    const s = this.#s ? this.#s.headers : this.#i ??= new Headers();
    r === void 0 ? s.delete(e) : t?.append ? s.append(e, r) : s.set(e, r);
  };
  status = (e) => {
    this.#a = e;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (e, r) => {
    this.#r ??= /* @__PURE__ */ new Map(), this.#r.set(e, r);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (e) => this.#r ? this.#r.get(e) : void 0;
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    return this.#r ? Object.fromEntries(this.#r) : {};
  }
  #o(e, r, t) {
    const s = this.#s ? new Headers(this.#s.headers) : this.#i ?? new Headers();
    if (typeof r == "object" && "headers" in r) {
      const a = r.headers instanceof Headers ? r.headers : new Headers(r.headers);
      for (const [o, i] of a)
        o.toLowerCase() === "set-cookie" ? s.append(o, i) : s.set(o, i);
    }
    if (t)
      for (const [a, o] of Object.entries(t))
        if (typeof o == "string")
          s.set(a, o);
        else {
          s.delete(a);
          for (const i of o)
            s.append(a, i);
        }
    const n = typeof r == "number" ? r : r?.status ?? this.#a;
    return new Response(e, { status: n, headers: s });
  }
  newResponse = (...e) => this.#o(...e);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (e, r, t) => this.#o(e, r, t);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (e, r, t) => !this.#i && !this.#a && !r && !t && !this.finalized ? new Response(e) : this.#o(
    e,
    r,
    ae(kt, t)
  );
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (e, r, t) => this.#o(
    JSON.stringify(e),
    r,
    ae("application/json", t)
  );
  html = (e, r, t) => {
    const s = (n) => this.#o(n, r, ae("text/html; charset=UTF-8", t));
    return typeof e == "object" ? Fe(e, Ot.Stringify, !1, {}).then(s) : s(e);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (e, r) => {
    const t = String(e);
    return this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      /[^\x00-\xFF]/.test(t) ? encodeURI(t) : t
    ), this.newResponse(null, r ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => (this.#c ??= () => new Response(), this.#c(this));
}, R = "ALL", jt = "all", Nt = ["get", "post", "put", "delete", "options", "patch"], Je = "Can not add a route since the matcher is already built.", ze = class extends Error {
}, Dt = "__COMPOSED_HANDLER", Ut = (e) => e.text("404 Not Found", 404), Re = (e, r) => {
  if ("getResponse" in e) {
    const t = e.getResponse();
    return r.newResponse(t.body, t);
  }
  return console.error(e), r.text("Internal Server Error", 500);
}, Lt = class We {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #t = "/";
  routes = [];
  constructor(r = {}) {
    [...Nt, jt].forEach((a) => {
      this[a] = (o, ...i) => (typeof o == "string" ? this.#t = o : this.#a(a, this.#t, o), i.forEach((l) => {
        this.#a(a, this.#t, l);
      }), this);
    }), this.on = (a, o, ...i) => {
      for (const l of [o].flat()) {
        this.#t = l;
        for (const c of [a].flat())
          i.map((u) => {
            this.#a(c.toUpperCase(), this.#t, u);
          });
      }
      return this;
    }, this.use = (a, ...o) => (typeof a == "string" ? this.#t = a : (this.#t = "*", o.unshift(a)), o.forEach((i) => {
      this.#a(R, this.#t, i);
    }), this);
    const { strict: s, ...n } = r;
    Object.assign(this, n), this.getPath = s ?? !0 ? r.getPath ?? De : Ct;
  }
  #e() {
    const r = new We({
      router: this.router,
      getPath: this.getPath
    });
    return r.errorHandler = this.errorHandler, r.#r = this.#r, r.routes = this.routes, r;
  }
  #r = Ut;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = Re;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(r, t) {
    const s = this.basePath(r);
    return t.routes.map((n) => {
      let a;
      t.errorHandler === Re ? a = n.handler : (a = async (o, i) => (await be([], t.errorHandler)(o, () => n.handler(o, i))).res, a[Dt] = n.handler), s.#a(n.method, n.path, a);
    }), this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(r) {
    const t = this.#e();
    return t._basePath = N(this._basePath, r), t;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (r) => (this.errorHandler = r, this);
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (r) => (this.#r = r, this);
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(r, t, s) {
    let n, a;
    s && (typeof s == "function" ? a = s : (a = s.optionHandler, s.replaceRequest === !1 ? n = (l) => l : n = s.replaceRequest));
    const o = a ? (l) => {
      const c = a(l);
      return Array.isArray(c) ? c : [c];
    } : (l) => {
      let c;
      try {
        c = l.executionCtx;
      } catch {
      }
      return [l.env, c];
    };
    n ||= (() => {
      const l = N(this._basePath, r), c = l === "/" ? 0 : l.length;
      return (u) => {
        const d = new URL(u.url);
        return d.pathname = d.pathname.slice(c) || "/", new Request(d, u);
      };
    })();
    const i = async (l, c) => {
      const u = await t(n(l.req.raw), ...o(l));
      if (u)
        return u;
      await c();
    };
    return this.#a(R, N(r, "*"), i), this;
  }
  #a(r, t, s) {
    r = r.toUpperCase(), t = N(this._basePath, t);
    const n = { basePath: this._basePath, path: t, method: r, handler: s };
    this.router.add(r, t, [s, n]), this.routes.push(n);
  }
  #n(r, t) {
    if (r instanceof Error)
      return this.errorHandler(r, t);
    throw r;
  }
  #s(r, t, s, n) {
    if (n === "HEAD")
      return (async () => new Response(null, await this.#s(r, t, s, "GET")))();
    const a = this.getPath(r, { env: s }), o = this.router.match(n, a), i = new Pt(r, {
      path: a,
      matchResult: o,
      env: s,
      executionCtx: t,
      notFoundHandler: this.#r
    });
    if (o[0].length === 1) {
      let c;
      try {
        c = o[0][0][0][0](i, async () => {
          i.res = await this.#r(i);
        });
      } catch (u) {
        return this.#n(u, i);
      }
      return c instanceof Promise ? c.then(
        (u) => u || (i.finalized ? i.res : this.#r(i))
      ).catch((u) => this.#n(u, i)) : c ?? this.#r(i);
    }
    const l = be(o[0], this.errorHandler, this.#r);
    return (async () => {
      try {
        const c = await l(i);
        if (!c.finalized)
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        return c.res;
      } catch (c) {
        return this.#n(c, i);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (r, ...t) => this.#s(r, t[1], t[0], r.method);
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (r, t, s, n) => r instanceof Request ? this.fetch(t ? new Request(r, t) : r, s, n) : (r = r.toString(), this.fetch(
    new Request(
      /^https?:\/\//.test(r) ? r : `http://localhost${N("/", r)}`,
      t
    ),
    s,
    n
  ));
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (r) => {
      r.respondWith(this.#s(r.request, r, void 0, r.request.method));
    });
  };
}, Ve = [];
function Bt(e, r) {
  const t = this.buildAllMatchers(), s = ((n, a) => {
    const o = t[n] || t[R], i = o[2][a];
    if (i)
      return i;
    const l = a.match(o[0]);
    if (!l)
      return [[], Ve];
    const c = l.indexOf("", 1);
    return [o[1][c], l];
  });
  return this.match = s, s(e, r);
}
var G = "[^/]+", J = ".*", z = "(?:|/.*)", D = /* @__PURE__ */ Symbol(), Kt = new Set(".\\+*[^]$()");
function Ft(e, r) {
  return e.length === 1 ? r.length === 1 ? e < r ? -1 : 1 : -1 : r.length === 1 || e === J || e === z ? 1 : r === J || r === z ? -1 : e === G ? 1 : r === G ? -1 : e.length === r.length ? e < r ? -1 : 1 : r.length - e.length;
}
var Jt = class ue {
  #t;
  #e;
  #r = /* @__PURE__ */ Object.create(null);
  insert(r, t, s, n, a) {
    if (r.length === 0) {
      if (this.#t !== void 0)
        throw D;
      if (a)
        return;
      this.#t = t;
      return;
    }
    const [o, ...i] = r, l = o === "*" ? i.length === 0 ? ["", "", J] : ["", "", G] : o === "/*" ? ["", "", z] : o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let c;
    if (l) {
      const u = l[1];
      let d = l[2] || G;
      if (u && l[2] && (d === ".*" || (d = d.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:"), /\((?!\?:)/.test(d))))
        throw D;
      if (c = this.#r[d], !c) {
        if (Object.keys(this.#r).some(
          (f) => f !== J && f !== z
        ))
          throw D;
        if (a)
          return;
        c = this.#r[d] = new ue(), u !== "" && (c.#e = n.varIndex++);
      }
      !a && u !== "" && s.push([u, c.#e]);
    } else if (c = this.#r[o], !c) {
      if (Object.keys(this.#r).some(
        (u) => u.length > 1 && u !== J && u !== z
      ))
        throw D;
      if (a)
        return;
      c = this.#r[o] = new ue();
    }
    c.insert(i, t, s, n, a);
  }
  buildRegExpStr() {
    const t = Object.keys(this.#r).sort(Ft).map((s) => {
      const n = this.#r[s];
      return (typeof n.#e == "number" ? `(${s})@${n.#e}` : Kt.has(s) ? `\\${s}` : s) + n.buildRegExpStr();
    });
    return typeof this.#t == "number" && t.unshift(`#${this.#t}`), t.length === 0 ? "" : t.length === 1 ? t[0] : "(?:" + t.join("|") + ")";
  }
}, zt = class {
  #t = { varIndex: 0 };
  #e = new Jt();
  insert(e, r, t) {
    const s = [], n = [];
    for (let o = 0; ; ) {
      let i = !1;
      if (e = e.replace(/\{[^}]+\}/g, (l) => {
        const c = `@\\${o}`;
        return n[o] = [c, l], o++, i = !0, c;
      }), !i)
        break;
    }
    const a = e.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let o = n.length - 1; o >= 0; o--) {
      const [i] = n[o];
      for (let l = a.length - 1; l >= 0; l--)
        if (a[l].indexOf(i) !== -1) {
          a[l] = a[l].replace(i, n[o][1]);
          break;
        }
    }
    return this.#e.insert(a, r, s, this.#t, t), s;
  }
  buildRegExp() {
    let e = this.#e.buildRegExpStr();
    if (e === "")
      return [/^$/, [], []];
    let r = 0;
    const t = [], s = [];
    return e = e.replace(/#(\d+)|@(\d+)|\.\*\$/g, (n, a, o) => a !== void 0 ? (t[++r] = Number(a), "$()") : (o !== void 0 && (s[Number(o)] = ++r), "")), [new RegExp(`^${e}`), t, s];
  }
}, Wt = [/^$/, [], /* @__PURE__ */ Object.create(null)], Ye = /* @__PURE__ */ Object.create(null);
function Ge(e) {
  return Ye[e] ??= new RegExp(
    e === "*" ? "" : `^${e.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (r, t) => t ? `\\${t}` : "(?:|/.*)"
    )}$`
  );
}
function Vt() {
  Ye = /* @__PURE__ */ Object.create(null);
}
function Yt(e) {
  const r = new zt(), t = [];
  if (e.length === 0)
    return Wt;
  const s = e.map(
    (c) => [!/\*|\/:/.test(c[0]), ...c]
  ).sort(
    ([c, u], [d, f]) => c ? 1 : d ? -1 : u.length - f.length
  ), n = /* @__PURE__ */ Object.create(null);
  for (let c = 0, u = -1, d = s.length; c < d; c++) {
    const [f, h, w] = s[c];
    f ? n[h] = [w.map(([y]) => [y, /* @__PURE__ */ Object.create(null)]), Ve] : u++;
    let m;
    try {
      m = r.insert(h, u, f);
    } catch (y) {
      throw y === D ? new ze(h) : y;
    }
    f || (t[u] = w.map(([y, g]) => {
      const v = /* @__PURE__ */ Object.create(null);
      for (g -= 1; g >= 0; g--) {
        const [b, x] = m[g];
        v[b] = x;
      }
      return [y, v];
    }));
  }
  const [a, o, i] = r.buildRegExp();
  for (let c = 0, u = t.length; c < u; c++)
    for (let d = 0, f = t[c].length; d < f; d++) {
      const h = t[c][d]?.[1];
      if (!h)
        continue;
      const w = Object.keys(h);
      for (let m = 0, y = w.length; m < y; m++)
        h[w[m]] = i[h[w[m]]];
    }
  const l = [];
  for (const c in o)
    l[c] = t[o[c]];
  return [a, l, n];
}
function P(e, r) {
  if (e) {
    for (const t of Object.keys(e).sort((s, n) => n.length - s.length))
      if (Ge(t).test(r))
        return [...e[t]];
  }
}
var Gt = class {
  name = "RegExpRouter";
  #t;
  #e;
  constructor() {
    this.#t = { [R]: /* @__PURE__ */ Object.create(null) }, this.#e = { [R]: /* @__PURE__ */ Object.create(null) };
  }
  add(e, r, t) {
    const s = this.#t, n = this.#e;
    if (!s || !n)
      throw new Error(Je);
    s[e] || [s, n].forEach((i) => {
      i[e] = /* @__PURE__ */ Object.create(null), Object.keys(i[R]).forEach((l) => {
        i[e][l] = [...i[R][l]];
      });
    }), r === "/*" && (r = "*");
    const a = (r.match(/\/:/g) || []).length;
    if (/\*$/.test(r)) {
      const i = Ge(r);
      e === R ? Object.keys(s).forEach((l) => {
        s[l][r] ||= P(s[l], r) || P(s[R], r) || [];
      }) : s[e][r] ||= P(s[e], r) || P(s[R], r) || [], Object.keys(s).forEach((l) => {
        (e === R || e === l) && Object.keys(s[l]).forEach((c) => {
          i.test(c) && s[l][c].push([t, a]);
        });
      }), Object.keys(n).forEach((l) => {
        (e === R || e === l) && Object.keys(n[l]).forEach(
          (c) => i.test(c) && n[l][c].push([t, a])
        );
      });
      return;
    }
    const o = Ue(r) || [r];
    for (let i = 0, l = o.length; i < l; i++) {
      const c = o[i];
      Object.keys(n).forEach((u) => {
        (e === R || e === u) && (n[u][c] ||= [
          ...P(s[u], c) || P(s[R], c) || []
        ], n[u][c].push([t, a - l + i + 1]));
      });
    }
  }
  match = Bt;
  buildAllMatchers() {
    const e = /* @__PURE__ */ Object.create(null);
    return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach((r) => {
      e[r] ||= this.#r(r);
    }), this.#t = this.#e = void 0, Vt(), e;
  }
  #r(e) {
    const r = [];
    let t = e === R;
    return [this.#t, this.#e].forEach((s) => {
      const n = s[e] ? Object.keys(s[e]).map((a) => [a, s[e][a]]) : [];
      n.length !== 0 ? (t ||= !0, r.push(...n)) : e !== R && r.push(
        ...Object.keys(s[R]).map((a) => [a, s[R][a]])
      );
    }), t ? Yt(r) : null;
  }
}, Xt = class {
  name = "SmartRouter";
  #t = [];
  #e = [];
  constructor(e) {
    this.#t = e.routers;
  }
  add(e, r, t) {
    if (!this.#e)
      throw new Error(Je);
    this.#e.push([e, r, t]);
  }
  match(e, r) {
    if (!this.#e)
      throw new Error("Fatal error");
    const t = this.#t, s = this.#e, n = t.length;
    let a = 0, o;
    for (; a < n; a++) {
      const i = t[a];
      try {
        for (let l = 0, c = s.length; l < c; l++)
          i.add(...s[l]);
        o = i.match(e, r);
      } catch (l) {
        if (l instanceof ze)
          continue;
        throw l;
      }
      this.match = i.match.bind(i), this.#t = [i], this.#e = void 0;
      break;
    }
    if (a === n)
      throw new Error("Fatal error");
    return this.name = `SmartRouter + ${this.activeRouter.name}`, o;
  }
  get activeRouter() {
    if (this.#e || this.#t.length !== 1)
      throw new Error("No active router has been determined yet.");
    return this.#t[0];
  }
}, F = /* @__PURE__ */ Object.create(null), Qt = class Xe {
  #t;
  #e;
  #r;
  #a = 0;
  #n = F;
  constructor(r, t, s) {
    if (this.#e = s || /* @__PURE__ */ Object.create(null), this.#t = [], r && t) {
      const n = /* @__PURE__ */ Object.create(null);
      n[r] = { handler: t, possibleKeys: [], score: 0 }, this.#t = [n];
    }
    this.#r = [];
  }
  insert(r, t, s) {
    this.#a = ++this.#a;
    let n = this;
    const a = Et(t), o = [];
    for (let i = 0, l = a.length; i < l; i++) {
      const c = a[i], u = a[i + 1], d = Ht(c, u), f = Array.isArray(d) ? d[0] : c;
      if (f in n.#e) {
        n = n.#e[f], d && o.push(d[1]);
        continue;
      }
      n.#e[f] = new Xe(), d && (n.#r.push(d), o.push(d[1])), n = n.#e[f];
    }
    return n.#t.push({
      [r]: {
        handler: s,
        possibleKeys: o.filter((i, l, c) => c.indexOf(i) === l),
        score: this.#a
      }
    }), n;
  }
  #s(r, t, s, n) {
    const a = [];
    for (let o = 0, i = r.#t.length; o < i; o++) {
      const l = r.#t[o], c = l[t] || l[R], u = {};
      if (c !== void 0 && (c.params = /* @__PURE__ */ Object.create(null), a.push(c), s !== F || n && n !== F))
        for (let d = 0, f = c.possibleKeys.length; d < f; d++) {
          const h = c.possibleKeys[d], w = u[c.score];
          c.params[h] = n?.[h] && !w ? n[h] : s[h] ?? n?.[h], u[c.score] = !0;
        }
    }
    return a;
  }
  search(r, t) {
    const s = [];
    this.#n = F;
    let a = [this];
    const o = Ne(t), i = [];
    for (let l = 0, c = o.length; l < c; l++) {
      const u = o[l], d = l === c - 1, f = [];
      for (let h = 0, w = a.length; h < w; h++) {
        const m = a[h], y = m.#e[u];
        y && (y.#n = m.#n, d ? (y.#e["*"] && s.push(
          ...this.#s(y.#e["*"], r, m.#n)
        ), s.push(...this.#s(y, r, m.#n))) : f.push(y));
        for (let g = 0, v = m.#r.length; g < v; g++) {
          const b = m.#r[g], x = m.#n === F ? {} : { ...m.#n };
          if (b === "*") {
            const M = m.#e["*"];
            M && (s.push(...this.#s(M, r, m.#n)), M.#n = x, f.push(M));
            continue;
          }
          const [A, K, $] = b;
          if (!u && !($ instanceof RegExp))
            continue;
          const H = m.#e[A], yt = o.slice(l).join("/");
          if ($ instanceof RegExp) {
            const M = $.exec(yt);
            if (M) {
              if (x[K] = M[0], s.push(...this.#s(H, r, m.#n, x)), Object.keys(H.#e).length) {
                H.#n = x;
                const gt = M[0].match(/\//)?.length ?? 0;
                (i[gt] ||= []).push(H);
              }
              continue;
            }
          }
          ($ === !0 || $.test(u)) && (x[K] = u, d ? (s.push(...this.#s(H, r, x, m.#n)), H.#e["*"] && s.push(
            ...this.#s(H.#e["*"], r, x, m.#n)
          )) : (H.#n = x, f.push(H)));
        }
      }
      a = f.concat(i.shift() ?? []);
    }
    return s.length > 1 && s.sort((l, c) => l.score - c.score), [s.map(({ handler: l, params: c }) => [l, c])];
  }
}, Zt = class {
  name = "TrieRouter";
  #t;
  constructor() {
    this.#t = new Qt();
  }
  add(e, r, t) {
    const s = Ue(r);
    if (s) {
      for (let n = 0, a = s.length; n < a; n++)
        this.#t.insert(e, s[n], t);
      return;
    }
    this.#t.insert(e, r, t);
  }
  match(e, r) {
    return this.#t.search(e, r);
  }
}, Qe = class extends Lt {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(e = {}) {
    super(e), this.router = e.router ?? new Xt({
      routers: [new Gt(), new Zt()]
    });
  }
}, S = {
  /** Observability policies (e.g. requestLog) — wraps everything */
  OBSERVABILITY: 0,
  /** IP filtering — runs before all other logic */
  IP_FILTER: 1,
  /** Metrics collection — just after observability */
  METRICS: 1,
  /** Early pipeline (e.g. cors) — before auth */
  EARLY: 5,
  /** Authentication (e.g. jwtAuth, apiKeyAuth, basicAuth) */
  AUTH: 10,
  /** Rate limiting — after auth */
  RATE_LIMIT: 20,
  /** Circuit breaker — protects upstream */
  CIRCUIT_BREAKER: 30,
  /** Caching — before upstream */
  CACHE: 40,
  /** Request header transforms — mid-pipeline */
  REQUEST_TRANSFORM: 50,
  /** Timeout — wraps upstream call */
  TIMEOUT: 85,
  /** Retry — wraps upstream fetch */
  RETRY: 90,
  /** Response header transforms — after upstream */
  RESPONSE_TRANSFORM: 92,
  /** Proxy header manipulation — just before upstream */
  PROXY: 95,
  /** Default priority for unspecified policies */
  DEFAULT: 100,
  /** Mock — terminal, replaces upstream */
  MOCK: 999
}, q = {
  HTTP_METHOD: "http.request.method",
  HTTP_ROUTE: "http.route",
  HTTP_STATUS_CODE: "http.response.status_code",
  URL_PATH: "url.path",
  SERVER_ADDRESS: "server.address"
}, Z = class {
  constructor(e, r, t, s, n, a = Date.now()) {
    this.name = e, this.kind = r, this.traceId = t, this.spanId = s, this.parentSpanId = n, this.startTimeMs = a;
  }
  _attributes = {};
  _events = [];
  _status = {
    code: "UNSET"
  };
  _endTimeMs;
  /** Set a single attribute. Chainable. */
  setAttribute(e, r) {
    return this._attributes[e] = r, this;
  }
  /** Record a timestamped event with optional attributes. Chainable. */
  addEvent(e, r) {
    return this._events.push({ name: e, timeMs: Date.now(), attributes: r }), this;
  }
  /** Set the span status. Chainable. */
  setStatus(e, r) {
    return this._status = { code: e, message: r }, this;
  }
  /**
   * Finalize the span and return an immutable {@link ReadableSpan}.
   *
   * Sets `endTimeMs` on first call; subsequent calls return the same
   * snapshot with defensive copies of mutable fields.
   */
  end() {
    return this._endTimeMs = this._endTimeMs ?? Date.now(), {
      traceId: this.traceId,
      spanId: this.spanId,
      parentSpanId: this.parentSpanId,
      name: this.name,
      kind: this.kind,
      startTimeMs: this.startTimeMs,
      endTimeMs: this._endTimeMs,
      attributes: { ...this._attributes },
      status: { ...this._status },
      events: [...this._events]
    };
  }
}, er = {
  INTERNAL: 1,
  // SPAN_KIND_INTERNAL
  SERVER: 2,
  // SPAN_KIND_SERVER
  CLIENT: 3
  // SPAN_KIND_CLIENT
}, tr = {
  UNSET: 0,
  // STATUS_CODE_UNSET
  OK: 1,
  // STATUS_CODE_OK
  ERROR: 2
  // STATUS_CODE_ERROR
};
function rr(e) {
  return typeof e == "string" ? { stringValue: e } : typeof e == "boolean" ? { boolValue: e } : Number.isInteger(e) ? { intValue: e } : { doubleValue: e };
}
function Ae(e) {
  return Object.entries(e).map(([r, t]) => ({
    key: r,
    value: rr(t)
  }));
}
function oe(e) {
  return String(e * 1e6);
}
function sr(e, r, t) {
  const s = [{ key: "service.name", value: { stringValue: r } }];
  t && s.push({
    key: "service.version",
    value: { stringValue: t }
  });
  const n = e.map((a) => {
    const o = {
      traceId: a.traceId,
      spanId: a.spanId,
      name: a.name,
      kind: er[a.kind],
      startTimeUnixNano: oe(a.startTimeMs),
      endTimeUnixNano: oe(a.endTimeMs),
      attributes: Ae(a.attributes),
      status: {
        code: tr[a.status.code],
        ...a.status.message ? { message: a.status.message } : {}
      },
      events: a.events.map((i) => ({
        name: i.name,
        timeUnixNano: oe(i.timeMs),
        ...i.attributes ? { attributes: Ae(i.attributes) } : {}
      }))
    };
    return a.parentSpanId && (o.parentSpanId = a.parentSpanId), o;
  });
  return {
    resourceSpans: [
      {
        resource: { attributes: s },
        scopeSpans: [
          {
            scope: { name: "stoma-gateway" },
            spans: n
          }
        ]
      }
    ]
  };
}
var fs = class {
  endpoint;
  headers;
  timeoutMs;
  serviceName;
  serviceVersion;
  constructor(e) {
    this.endpoint = e.endpoint, this.headers = e.headers ?? {}, this.timeoutMs = e.timeoutMs ?? 1e4, this.serviceName = e.serviceName ?? "stoma-gateway", this.serviceVersion = e.serviceVersion;
  }
  async export(e) {
    if (e.length === 0) return;
    const r = sr(e, this.serviceName, this.serviceVersion);
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...this.headers
      },
      body: JSON.stringify(r),
      signal: AbortSignal.timeout(this.timeoutMs)
    });
  }
}, ms = class {
  async export(e) {
    for (const r of e)
      console.debug(
        `[trace] ${r.name} ${r.kind} ${r.endTimeMs - r.startTimeMs}ms trace=${r.traceId} span=${r.spanId}` + (r.parentSpanId ? ` parent=${r.parentSpanId}` : "") + ` status=${r.status.code}`
      );
  }
};
function nr(e) {
  return e >= 1 ? !0 : e <= 0 ? !1 : Math.random() < e;
}
function ee() {
  const e = new Uint8Array(8);
  return crypto.getRandomValues(e), Array.from(e, (r) => r.toString(16).padStart(2, "0")).join("");
}
var U = "_stomaTraceRequested", de = "_stomaTraceEntries", he = "_stomaTraceDetails", Ze = () => {
};
function te(e, r) {
  return e.get(U) ? (t, s) => {
    const n = e.get(he) ?? /* @__PURE__ */ new Map();
    n.set(r, { action: t, data: s }), e.set(he, n);
  } : Ze;
}
function ar(e) {
  return e.get(U) === !0;
}
var I = () => {
};
function or(e, r) {
  return !r || typeof r == "string" && !ir(e, r) ? I : (t, ...s) => {
    const n = [`[${e}]`, t];
    for (const a of s)
      n.push(
        typeof a == "object" && a !== null ? JSON.stringify(a) : String(a)
      );
    console.debug(n.join(" "));
  };
}
function ir(e, r) {
  return r.split(",").map((s) => s.trim()).some((s) => {
    if (s === "*") return !0;
    const n = s.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${n}$`).test(e);
  });
}
function lr(e) {
  if (!e) return () => I;
  const r = /* @__PURE__ */ new Map();
  return (t) => {
    const s = r.get(t);
    if (s) return s;
    const n = or(t, e);
    return r.set(t, n), n;
  };
}
function et(e) {
  const r = e.map((t, s) => ({
    ...t,
    durationMs: s === 0 ? t.durationMs : Math.max(0, t.durationMs - e[s - 1].durationMs)
  }));
  return r.reverse(), r;
}
var cr = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;
function ur(e) {
  if (!e) return null;
  const r = e.trim().match(cr);
  if (!r) return null;
  const [, t, s, n, a] = r;
  return t === "ff" || s === "00000000000000000000000000000000" || n === "0000000000000000" ? null : { version: t, traceId: s, parentId: n, flags: a };
}
function dr() {
  return {
    version: "00",
    traceId: tt(16),
    parentId: re(),
    flags: "01"
  };
}
function Se(e) {
  return `${e.version}-${e.traceId}-${e.parentId}-${e.flags}`;
}
function re() {
  return tt(8);
}
function tt(e) {
  const r = new Uint8Array(e);
  return crypto.getRandomValues(r), Array.from(r, (t) => t.toString(16).padStart(2, "0")).join("");
}
var hr = () => I, rt = "gateway";
function pr(e, r, t, s = 100) {
  const n = /* @__PURE__ */ new Map();
  for (const o of e)
    n.set(o.name, o);
  for (const o of r)
    n.has(o.name) && t?.(`policy "${o.name}" overridden by route-level policy`), n.set(o.name, o);
  const a = Array.from(n.values()).sort(
    (o, i) => (o.priority ?? s) - (i.priority ?? s)
  );
  return a.length > 0 && t?.(
    `chain: ${a.map((o) => `${o.name}:${o.priority ?? s}`).join(" -> ")}`
  ), a;
}
function fr(e) {
  return e.map((r) => {
    const t = r.handler, s = r.priority ?? 100;
    return async (a, o) => {
      const i = Date.now();
      if (a.get(U) !== !0 && a.get("_otelSpans") === void 0) {
        try {
          await t(a, o);
        } finally {
          const u = Date.now() - i, d = a.get("_policyTimings") ?? [];
          d.push({ name: r.name, durationMs: u }), a.set("_policyTimings", d);
        }
        return;
      }
      let l = !1, c = null;
      try {
        await t(a, async () => {
          l = !0, await o();
        });
      } catch (u) {
        throw c = u instanceof Error ? u.message : String(u), u;
      } finally {
        const u = Date.now() - i, d = a.get("_policyTimings") ?? [];
        if (d.push({ name: r.name, durationMs: u }), a.set("_policyTimings", d), a.get(U) === !0) {
          const h = a.get(de) ?? [];
          h.push({
            name: r.name,
            priority: s,
            durationMs: u,
            calledNext: l,
            error: c
          }), a.set(de, h);
        }
        const f = a.get("_otelSpans");
        if (f !== void 0) {
          const h = a.get("_otelRootSpan"), w = new Z(
            `policy:${r.name}`,
            "INTERNAL",
            h.traceId,
            ee(),
            h.spanId,
            i
          );
          w.setAttribute("policy.name", r.name).setAttribute("policy.priority", s), c && w.setStatus("ERROR", c), f.push(w.end());
        }
      }
    };
  });
}
function st(e, r, t = hr, s = "x-request-id", n, a, o) {
  const i = a === !0 ? {} : a || void 0, l = i?.requestHeader ?? "x-stoma-debug", c = i?.allow;
  return async (u, d) => {
    const f = u.req.header("traceparent") ?? null, h = ur(f), w = h?.traceId ?? dr().traceId, m = re(), y = {
      requestId: crypto.randomUUID(),
      startTime: Date.now(),
      gatewayName: e,
      routePath: r,
      traceId: w,
      spanId: m,
      debug: t,
      adapter: n
    };
    u.set(rt, y);
    let g;
    if (o && nr(o.sampleRate ?? 1)) {
      const v = ee();
      g = new Z(
        `${u.req.method} ${r}`,
        "SERVER",
        w,
        v,
        h?.parentId,
        y.startTime
      ), g.setAttribute(q.HTTP_METHOD, u.req.method).setAttribute(q.HTTP_ROUTE, r).setAttribute(q.URL_PATH, new URL(u.req.url).pathname).setAttribute("gateway.name", e), u.set("_otelRootSpan", g), u.set("_otelSpans", []);
    }
    if (i && nt(u, l, c), await d(), u.res.headers.set(s, y.requestId), u.res.headers.set(
      "traceparent",
      Se({
        version: "00",
        traceId: y.traceId,
        parentId: y.spanId,
        flags: h?.flags ?? "01"
      })
    ), i) {
      const v = at(u);
      if (v)
        for (const [b, x] of v)
          u.res.headers.set(b, x);
    }
    if (u.get(U) === !0) {
      const v = u.get(de);
      if (v && v.length > 0) {
        const b = u.get(he), A = et(v).map(($) => {
          const H = b?.get($.name);
          return H ? { ...$, detail: H } : $;
        }), K = {
          requestId: y.requestId,
          traceId: y.traceId,
          route: r,
          totalMs: Date.now() - y.startTime,
          entries: A
        };
        u.res.headers.set("x-stoma-trace", JSON.stringify(K));
      }
    }
    if (g) {
      g.setAttribute(q.HTTP_STATUS_CODE, u.res.status).setStatus(
        u.res.status >= 500 ? "ERROR" : u.res.status >= 400 ? "UNSET" : "OK"
      );
      const v = g.end(), b = u.get("_otelSpans") ?? [], x = [v, ...b], A = o.exporter.export(x).catch(() => {
      });
      n?.waitUntil && n.waitUntil(A);
    }
  };
}
function B(e) {
  return e.get(rt);
}
function k(e, r) {
  return r ? { ...e, ...r } : { ...e };
}
function O(e, r) {
  return B(e)?.debug(`stoma:policy:${r}`) ?? I;
}
function C(e, r) {
  return e ? async (t, s) => {
    if (await e(t)) {
      await s();
      return;
    }
    await r(t, s);
  } : r;
}
async function E(e, r, t, s) {
  try {
    return await e();
  } catch (n) {
    return t && s && t(
      `${s} failed: ${n instanceof Error ? n.message : String(n)}`
    ), r;
  }
}
var pe = "_stomaDebugHeaders", ve = "_stomaDebugRequested";
function _(e, r, t) {
  const s = e.get(ve);
  if (!s || !(s.has(r) || s.has("*"))) return;
  const n = e.get(pe) ?? /* @__PURE__ */ new Map();
  n.set(r, String(t)), e.set(pe, n);
}
function nt(e, r, t) {
  const s = e.req.header(r);
  if (!s) return;
  const n = s.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean);
  if (n.length === 0) return;
  const a = t ? new Set(t.map((i) => i.toLowerCase())) : null, o = /* @__PURE__ */ new Set();
  if (n.includes("*"))
    if (a)
      for (const i of a) o.add(i);
    else
      o.add("*");
  for (const i of n)
    i !== "*" && (!a || a.has(i)) && o.add(i);
  o.size > 0 && e.set(ve, o), (o.has("trace") || o.has("*")) && e.set(U, !0);
}
function at(e) {
  return e.get(pe);
}
function ot(e) {
  const r = e.get(ve);
  return r !== void 0 && r.size > 0;
}
function T(e) {
  return (r) => {
    const t = k(
      e.defaults ?? {},
      r
    );
    e.validate && e.validate(t);
    const s = async (o, i) => {
      const l = O(o, e.name), c = te(o, e.name), u = B(o);
      await e.handler(o, i, { config: t, debug: l, trace: c, gateway: u });
    }, n = C(t.skip, s);
    let a;
    if (e.evaluate) {
      const o = e.evaluate;
      a = {
        onRequest: o.onRequest ? (i, l) => o.onRequest(i, { ...l, config: t }) : void 0,
        onResponse: o.onResponse ? (i, l) => o.onResponse(i, { ...l, config: t }) : void 0
      };
    }
    return {
      name: e.name,
      priority: e.priority ?? S.DEFAULT,
      handler: n,
      evaluate: a,
      phases: e.phases
    };
  };
}
var mr = class {
  promises = [];
  /**
   * Add a promise to the background work queue.
   */
  waitUntil = (e) => {
    this.promises.push(e);
  };
  /**
   * Await all pending background work collected via `waitUntil`.
   */
  async waitAll() {
    for (; this.promises.length > 0; ) {
      const e = [...this.promises];
      this.promises = [], await Promise.all(e);
    }
  }
  /**
   * Reset the collected promises.
   */
  reset() {
    this.promises = [];
  }
};
function wr(e, r) {
  const t = r?.path ?? "/*", s = r?.gatewayName ?? "test-gateway", n = r?.adapter ?? new mr(), a = new Qe();
  return a.use(
    t,
    st(s, t, void 0, void 0, n)
  ), a.use(t, async (o, i) => {
    try {
      await e.handler(o, i);
    } catch (l) {
      if (l instanceof p)
        return je(l);
      throw l;
    }
  }), r?.upstream ? a.all(t, r.upstream) : a.all(t, (o) => o.json({ ok: !0 })), {
    /** The underlying Hono app for advanced test scenarios. */
    app: a,
    /** The adapter used by the harness. Call `adapter.waitAll()` to await background tasks. */
    adapter: n,
    /** Make a test request through the policy pipeline. */
    request: (o, i) => a.request(o, i)
  };
}
var it = class {
  entries = /* @__PURE__ */ new Map();
  maxEntries;
  constructor(e) {
    this.maxEntries = e?.maxEntries;
  }
  async get(e) {
    const r = this.entries.get(e);
    return r ? Date.now() > r.expiresAt ? (this.entries.delete(e), null) : (this.entries.delete(e), this.entries.set(e, r), new Response(r.body, {
      status: r.status,
      headers: r.headers
    })) : null;
  }
  async put(e, r, t) {
    const s = await r.arrayBuffer(), n = [];
    if (r.headers.forEach((a, o) => {
      n.push([o, a]);
    }), this.maxEntries && !this.entries.has(e) && this.entries.size >= this.maxEntries) {
      const a = this.entries.keys().next().value;
      a !== void 0 && this.entries.delete(a);
    }
    this.entries.set(e, {
      body: s,
      status: r.status,
      headers: n,
      expiresAt: Date.now() + t * 1e3
    });
  }
  async delete(e) {
    return this.entries.delete(e);
  }
  /** Remove all entries (for testing) */
  clear() {
    this.entries.clear();
  }
  /** Current number of entries (for testing/inspection) */
  get size() {
    return this.entries.size;
  }
}, ie = "x-stoma-internal-expires-at", yr = /* @__PURE__ */ new Set(["POST", "PUT", "PATCH"]);
function gr(e) {
  return e ? e.split(",").map((r) => r.trim().split("=")[0].trim().toLowerCase()) : [];
}
function ws(e) {
  const r = k(
    {
      ttlSeconds: 300,
      methods: ["GET"],
      respectCacheControl: !0,
      cacheStatusHeader: "x-cache",
      bypassDirectives: ["no-store", "no-cache"]
    },
    e
  ), t = r.methods.map((l) => l.toUpperCase());
  let s = e?.store;
  s || (s = new it());
  const n = s, a = r.cacheStatusHeader;
  async function o(l) {
    if (e?.cacheKeyFn) return await e.cacheKeyFn(l);
    let c = `${l.req.method}:${l.req.url}`;
    if (yr.has(l.req.method.toUpperCase()))
      try {
        const u = await l.req.raw.clone().text();
        if (u) {
          const d = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(u)
          ), f = new Uint8Array(d);
          let h = "";
          for (const w of f)
            h += w.toString(16).padStart(2, "0");
          c += `|body:${h}`;
        }
      } catch {
      }
    if (e?.varyHeaders) {
      const u = e.varyHeaders.map((d) => l.req.header(d) ?? "").join("|");
      c += `|vary:${u}`;
    }
    return c;
  }
  const i = async (l, c) => {
    const u = O(l, "cache"), d = te(l, "cache");
    if (!t.includes(l.req.method.toUpperCase())) {
      d("SKIP", { method: l.req.method }), await c(), l.res.headers.set(a, "SKIP");
      return;
    }
    const f = await o(l);
    _(l, "x-stoma-cache-key", f), _(l, "x-stoma-cache-ttl", r.ttlSeconds);
    const h = await E(
      () => n.get(f),
      null,
      u,
      "store.get()"
    );
    if (h) {
      u(`HIT ${f}`), _(l, "x-stoma-cache-status", "HIT"), d("HIT", { key: f });
      const g = h.headers.get(ie);
      if (g) {
        const x = Math.max(
          0,
          Math.ceil((Number(g) - Date.now()) / 1e3)
        );
        _(l, "x-stoma-cache-expires-in", x);
      }
      const v = await h.arrayBuffer(), b = new Response(v, {
        status: h.status,
        headers: h.headers
      });
      b.headers.delete(ie), b.headers.set(a, "HIT"), l.res = b;
      return;
    }
    if (await c(), l.res.status >= 500) {
      u(`SKIP ${f} (status=${l.res.status})`), _(l, "x-stoma-cache-status", "SKIP"), l.res.headers.set(a, "SKIP");
      return;
    }
    if (r.cacheableStatuses && !r.cacheableStatuses.includes(l.res.status)) {
      u(`SKIP ${f} (status=${l.res.status} not in cacheableStatuses)`), _(l, "x-stoma-cache-status", "SKIP"), l.res.headers.set(a, "SKIP");
      return;
    }
    if (r.respectCacheControl) {
      const g = l.res.headers.get("cache-control") ?? "", v = gr(g);
      if (r.bypassDirectives.some(
        (b) => v.includes(b.toLowerCase())
      )) {
        u(`BYPASS ${f} (cache-control: ${g})`), _(l, "x-stoma-cache-status", "BYPASS"), d("BYPASS", { key: f, directive: g }), l.res.headers.set(a, "BYPASS");
        return;
      }
    }
    u(`MISS ${f} (ttl=${r.ttlSeconds}s)`), _(l, "x-stoma-cache-status", "MISS"), d("MISS", { key: f, ttl: r.ttlSeconds });
    const w = l.res.clone(), m = await w.arrayBuffer(), y = new Headers(w.headers);
    y.set(
      ie,
      String(Date.now() + r.ttlSeconds * 1e3)
    ), await E(
      () => n.put(
        f,
        new Response(m, {
          status: w.status,
          headers: y
        }),
        r.ttlSeconds
      ),
      void 0,
      u,
      "store.put()"
    ), l.res.headers.set(a, "MISS");
  };
  return {
    name: "cache",
    priority: S.CACHE,
    handler: C(e?.skip, i)
  };
}
var Sr = ["cf-connecting-ip", "x-forwarded-for"];
function X(e, r = Sr) {
  for (const t of r) {
    const s = e.get(t);
    if (s) return s.split(",")[0].trim();
  }
  return "unknown";
}
var lt = class {
  counters = /* @__PURE__ */ new Map();
  cleanupInterval = null;
  /** Maximum number of unique keys to prevent memory exhaustion */
  maxKeys;
  cleanupIntervalMs;
  constructor(e) {
    typeof e == "number" ? (this.maxKeys = e, this.cleanupIntervalMs = 6e4) : (this.maxKeys = e?.maxKeys ?? 1e5, this.cleanupIntervalMs = e?.cleanupIntervalMs ?? 6e4);
  }
  /** Start the periodic cleanup interval on first use (Workers-safe). */
  ensureCleanupInterval() {
    this.cleanupInterval || (this.cleanupInterval = setInterval(
      () => this.cleanup(),
      this.cleanupIntervalMs
    ));
  }
  async increment(e, r) {
    this.ensureCleanupInterval();
    const t = Date.now(), s = this.counters.get(e);
    if (s && s.resetAt > t)
      return s.count++, { count: s.count, resetAt: s.resetAt };
    if (this.counters.size >= this.maxKeys && !s && (this.cleanup(), this.counters.size >= this.maxKeys)) {
      const o = t + r * 1e3;
      return { count: Number.MAX_SAFE_INTEGER, resetAt: o };
    }
    const n = t + r * 1e3, a = { count: 1, resetAt: n };
    return this.counters.set(e, a), { count: 1, resetAt: n };
  }
  cleanup() {
    const e = Date.now();
    for (const [r, t] of this.counters)
      t.resetAt <= e && this.counters.delete(r);
  }
  /** Stop the cleanup interval (for testing) */
  destroy() {
    this.cleanupInterval && (clearInterval(this.cleanupInterval), this.cleanupInterval = null);
  }
  /** Reset all counters (for testing) */
  reset() {
    this.counters.clear();
  }
};
function ys(e) {
  const r = k(
    { windowSeconds: 60, statusCode: 429, message: "Rate limit exceeded" },
    e
  );
  let t;
  const s = async (n, a) => {
    const o = O(n, "rate-limit"), i = te(n, "rate-limit");
    !e.store && !t && (t = new lt());
    const l = e.store ?? t;
    let c;
    e.keyBy ? c = await e.keyBy(n) : c = X(n.req.raw.headers, e.ipHeaders);
    const u = await E(
      () => l.increment(c, r.windowSeconds),
      null,
      o,
      "store.increment()"
    );
    if (!u) {
      o(`store unavailable, failing open (key=${c})`), await a();
      return;
    }
    const { count: d, resetAt: f } = u, h = Math.max(0, e.max - d), w = Math.ceil((f - Date.now()) / 1e3);
    if (_(n, "x-stoma-ratelimit-key", c), _(n, "x-stoma-ratelimit-window", r.windowSeconds), d > e.max) {
      o(`limited (key=${c}, count=${d}, max=${e.max})`), i("rejected", { key: c, count: d, max: e.max });
      const m = String(w);
      throw new p(
        r.statusCode,
        "rate_limited",
        r.message,
        {
          "x-ratelimit-limit": String(e.max),
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": m,
          "retry-after": m
        }
      );
    }
    i("allowed", { key: c, count: d, max: e.max, remaining: h }), await a(), n.res.headers.set("x-ratelimit-limit", String(e.max)), n.res.headers.set("x-ratelimit-remaining", String(h)), n.res.headers.set("x-ratelimit-reset", String(w));
  };
  return {
    name: "rate-limit",
    priority: S.RATE_LIMIT,
    handler: C(e.skip, s)
  };
}
var vr = (e) => {
  const t = {
    ...{
      origin: "*",
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      allowHeaders: [],
      exposeHeaders: []
    },
    ...e
  }, s = /* @__PURE__ */ ((a) => typeof a == "string" ? a === "*" ? () => a : (o) => a === o ? o : null : typeof a == "function" ? a : (o) => a.includes(o) ? o : null)(t.origin), n = ((a) => typeof a == "function" ? a : Array.isArray(a) ? () => a : () => [])(t.allowMethods);
  return async function(o, i) {
    function l(u, d) {
      o.res.headers.set(u, d);
    }
    const c = await s(o.req.header("origin") || "", o);
    if (c && l("Access-Control-Allow-Origin", c), t.credentials && l("Access-Control-Allow-Credentials", "true"), t.exposeHeaders?.length && l("Access-Control-Expose-Headers", t.exposeHeaders.join(",")), o.req.method === "OPTIONS") {
      t.origin !== "*" && l("Vary", "Origin"), t.maxAge != null && l("Access-Control-Max-Age", t.maxAge.toString());
      const u = await n(o.req.header("origin") || "", o);
      u.length && l("Access-Control-Allow-Methods", u.join(","));
      let d = t.allowHeaders;
      if (!d?.length) {
        const f = o.req.header("Access-Control-Request-Headers");
        f && (d = f.split(/\s*,\s*/));
      }
      return d?.length && (l("Access-Control-Allow-Headers", d.join(",")), o.res.headers.append("Vary", "Access-Control-Request-Headers")), o.res.headers.delete("Content-Length"), o.res.headers.delete("Content-Type"), new Response(null, {
        headers: o.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await i(), t.origin !== "*" && o.header("Vary", "Origin", { append: !0 });
  };
}, gs = T({
  name: "mock",
  priority: S.MOCK,
  defaults: { status: 200, delayMs: 0 },
  validate: (e) => {
    e.allowInProduction || console.warn(
      "[stoma] mock policy active — intended for development/testing only"
    );
  },
  handler: async (e, r, { config: t }) => {
    t.delayMs > 0 && await new Promise((a) => setTimeout(a, t.delayMs));
    const s = t.body === void 0 ? null : typeof t.body == "string" ? t.body : JSON.stringify(t.body), n = new Headers(t.headers);
    typeof t.body == "object" && !n.has("content-type") && n.set("content-type", "application/json"), e.res = new Response(s, { status: t.status, headers: n });
  }
});
function Ss(e) {
  const r = e?.timeout ?? 3e4, t = async (s, n) => {
    if (e?.preserveHost && s.set("_preserveHost", !0), e?.stripHeaders || e?.headers) {
      const a = new Headers(s.req.raw.headers);
      if (e.stripHeaders)
        for (const o of e.stripHeaders)
          a.delete(o);
      if (e.headers)
        for (const [o, i] of Object.entries(e.headers))
          a.set(o, i);
      s.req.raw = new Request(s.req.raw, { headers: a });
    }
    if (r > 0) {
      const a = new AbortController(), o = setTimeout(() => a.abort(), r);
      try {
        await n();
      } finally {
        clearTimeout(o);
      }
    } else
      await n();
  };
  return {
    name: "proxy",
    priority: S.PROXY,
    handler: C(e?.skip, t)
  };
}
var vs = T({
  name: "api-key-auth",
  priority: S.AUTH,
  defaults: { headerName: "x-api-key" },
  handler: async (e, r, { config: t, debug: s, trace: n }) => {
    let a = e.req.header(t.headerName), o = "header";
    if (!a && t.queryParam && (a = new URL(e.req.url).searchParams.get(t.queryParam) ?? void 0, o = "query"), !a)
      throw n("rejected", { reason: "missing" }), new p(401, "unauthorized", "Missing API key");
    if (!await t.validate(a))
      throw n("rejected", { reason: "invalid" }), new p(403, "forbidden", "Invalid API key");
    if (n("authenticated", { source: o }), t.forwardKeyIdentity) {
      const c = (await t.forwardKeyIdentity.identityFn(a)).replace(/[\r\n\0]/g, ""), u = new Headers(e.req.raw.headers);
      u.set(t.forwardKeyIdentity.headerName, c), e.req.raw = new Request(e.req.raw, { headers: u }), s(
        `forwarded key identity as ${t.forwardKeyIdentity.headerName}`
      );
    }
    await r();
  }
}), Ts = T({
  name: "basic-auth",
  priority: S.AUTH,
  defaults: { realm: "Restricted" },
  handler: async (e, r, { config: t }) => {
    const s = (t.realm ?? "Restricted").replace(/[\r\n\0]/g, "").replace(/"/g, '\\"'), n = e.req.header("authorization");
    if (!n || !n.startsWith("Basic "))
      throw e.header("www-authenticate", `Basic realm="${s}"`), new p(
        401,
        "unauthorized",
        "Basic authentication required"
      );
    let a, o;
    try {
      const l = atob(n.slice(6)), c = l.indexOf(":");
      if (c === -1)
        throw new Error("Invalid format");
      a = l.slice(0, c), o = l.slice(c + 1);
    } catch {
      throw new p(
        401,
        "unauthorized",
        "Malformed Basic authentication header"
      );
    }
    if (!await t.validate(a, o, e))
      throw e.header("www-authenticate", `Basic realm="${s}"`), new p(403, "forbidden", "Invalid credentials");
    await r();
  }
});
function W(e) {
  const r = e.replace(/-/g, "+").replace(/_/g, "/"), t = r + "=".repeat((4 - r.length % 4) % 4);
  return atob(t);
}
function Te(e) {
  const r = W(e), t = new Uint8Array(r.length);
  for (let s = 0; s < r.length; s++)
    t[s] = r.charCodeAt(s);
  return t;
}
function Tr(e) {
  let r = "";
  for (let t = 0; t < e.length; t++)
    r += String.fromCharCode(e[t]);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function ct(e) {
  switch (e) {
    case "HS256":
      return "SHA-256";
    case "HS384":
      return "SHA-384";
    case "HS512":
      return "SHA-512";
    default:
      return null;
  }
}
function ut(e) {
  switch (e) {
    case "RS256":
      return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
    case "RS384":
      return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" };
    case "RS512":
      return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" };
    default:
      return null;
  }
}
var br = 3e5, xr = 1e4, fe = /* @__PURE__ */ new Map();
async function dt(e, r, t) {
  const s = fe.get(e);
  if (s && s.expiresAt > Date.now())
    return s.keys;
  const n = t ?? xr;
  let a;
  try {
    a = await fetch(e, { signal: AbortSignal.timeout(n) });
  } catch (l) {
    throw l instanceof DOMException && l.name === "TimeoutError" ? new p(
      502,
      "jwks_error",
      `JWKS fetch timed out after ${n}ms: ${e}`
    ) : new p(
      502,
      "jwks_error",
      `Failed to fetch JWKS from ${e}: ${l instanceof Error ? l.message : String(l)}`
    );
  }
  if (!a.ok)
    throw new p(
      502,
      "jwks_error",
      `Failed to fetch JWKS from ${e}: ${a.status}`
    );
  const o = r ?? br, i = await a.json();
  return fe.set(e, { keys: i.keys, expiresAt: Date.now() + o }), i.keys;
}
function bs() {
  fe.clear();
}
function Rr(e, r) {
  const t = new URL(r.url);
  switch (e) {
    case "@method":
      return r.method.toUpperCase();
    case "@path":
      return t.pathname;
    case "@authority":
      return t.host;
    case "@scheme":
      return t.protocol.replace(":", "");
    case "@target-uri":
      return t.href;
    default:
      throw new Error(`Unknown derived component: ${e}`);
  }
}
function Ar(e, r) {
  return e.startsWith("@") ? Rr(e, r) : r.headers.get(e) ?? "";
}
function ht(e, r, t) {
  const s = [];
  for (const n of e) {
    const a = Ar(n, t);
    s.push(`"${n}": ${a}`);
  }
  return s.push(`"@signature-params": ${r}`), s.join(`
`);
}
function Er(e, r) {
  let s = `(${e.map((n) => `"${n}"`).join(" ")});created=${r.created};keyid="${r.keyId}"`;
  return r.algorithm && (s += `;alg="${r.algorithm}"`), r.expires !== void 0 && (s += `;expires=${r.expires}`), r.nonce !== void 0 && (s += `;nonce="${r.nonce}"`), s;
}
function $r(e) {
  const r = e.match(/^\(([^)]*)\)/);
  if (!r)
    throw new Error("Invalid signature params: missing component list");
  const t = r[1], s = t ? t.match(/"([^"]+)"/g)?.map((l) => l.slice(1, -1)) ?? [] : [], n = e.slice(r[0].length), a = {}, o = /;(\w+)=("([^"]*)"|(\d+))/g;
  let i = o.exec(n);
  for (; i !== null; )
    a[i[1]] = i[3] ?? i[4], i = o.exec(n);
  return { components: s, params: a };
}
function se(e) {
  switch (e) {
    case "hmac-sha256":
      return {
        importAlg: { name: "HMAC", hash: "SHA-256" },
        signAlg: "HMAC"
      };
    case "rsa-v1_5-sha256":
      return {
        importAlg: { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        signAlg: "RSASSA-PKCS1-v1_5"
      };
    case "rsa-pss-sha512":
      return {
        importAlg: { name: "RSA-PSS", hash: "SHA-512" },
        signAlg: { name: "RSA-PSS", saltLength: 64 }
      };
    default:
      throw new Error(`Unsupported signature algorithm: ${e}`);
  }
}
async function _r(e, r, t) {
  const { importAlg: s } = se(e);
  if (e.startsWith("hmac")) {
    if (!r) throw new Error("HMAC algorithm requires secret");
    const n = new TextEncoder();
    return crypto.subtle.importKey(
      "raw",
      n.encode(r),
      s,
      !1,
      ["sign"]
    );
  }
  if (!t) throw new Error("RSA algorithm requires privateKey");
  return crypto.subtle.importKey("jwk", t, s, !1, ["sign"]);
}
async function Hr(e, r, t) {
  const { importAlg: s } = se(e);
  if (e.startsWith("hmac")) {
    if (!r) throw new Error("HMAC algorithm requires secret");
    const n = new TextEncoder();
    return crypto.subtle.importKey(
      "raw",
      n.encode(r),
      s,
      !1,
      ["verify"]
    );
  }
  if (!t) throw new Error("RSA algorithm requires publicKey");
  return crypto.subtle.importKey("jwk", t, s, !1, [
    "verify"
  ]);
}
function qr(e) {
  return btoa(String.fromCharCode(...new Uint8Array(e)));
}
function Cr(e) {
  const r = atob(e), t = new Uint8Array(r.length);
  for (let s = 0; s < r.length; s++)
    t[s] = r.charCodeAt(s);
  return t;
}
var xs = T({
  name: "generate-http-signature",
  priority: S.PROXY,
  defaults: {
    components: ["@method", "@path", "@authority"],
    signatureHeaderName: "Signature",
    signatureInputHeaderName: "Signature-Input",
    label: "sig1",
    nonce: !1
  },
  handler: async (e, r, { config: t, debug: s }) => {
    if (!t.secret && !t.privateKey)
      throw new p(
        500,
        "config_error",
        "generateHttpSignature requires either 'secret' or 'privateKey'"
      );
    const n = t.components, a = t.label, o = Math.floor(Date.now() / 1e3), i = {
      created: o,
      keyId: t.keyId,
      algorithm: t.algorithm
    };
    t.expires !== void 0 && (i.expires = o + t.expires), t.nonce && (i.nonce = crypto.randomUUID().replace(/-/g, ""));
    const l = Er(n, i), c = ht(
      n,
      l,
      e.req.raw
    );
    s(
      `signing with ${t.algorithm}, components: ${n.join(", ")}`
    );
    const u = await _r(
      t.algorithm,
      t.secret,
      t.privateKey
    ), { signAlg: d } = se(t.algorithm), f = new TextEncoder(), h = await crypto.subtle.sign(
      d,
      u,
      f.encode(c)
    ), w = qr(h), m = new Headers(e.req.raw.headers);
    m.set(
      t.signatureInputHeaderName,
      `${a}=${l}`
    ), m.set(t.signatureHeaderName, `${a}=:${w}:`), e.req.raw = new Request(e.req.raw, { headers: m }), s("signature headers attached"), await r();
  }
});
function Mr(e) {
  let r = "";
  for (let t = 0; t < e.length; t++)
    r += String.fromCharCode(e[t]);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Ee(e) {
  return btoa(e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Ir(e) {
  switch (e) {
    case "HS256":
    case "RS256":
      return "SHA-256";
    case "HS384":
    case "RS384":
      return "SHA-384";
    case "HS512":
    case "RS512":
      return "SHA-512";
  }
}
function $e(e) {
  return e.startsWith("HS");
}
var Rs = T({
  name: "generate-jwt",
  priority: S.REQUEST_TRANSFORM,
  defaults: {
    expiresIn: 3600,
    headerName: "Authorization",
    tokenPrefix: "Bearer"
  },
  handler: async (e, r, { config: t, debug: s }) => {
    if ($e(t.algorithm)) {
      if (!t.secret)
        throw new p(
          500,
          "config_error",
          "generateJwt with HMAC algorithm requires 'secret'"
        );
    } else if (!t.privateKey)
      throw new p(
        500,
        "config_error",
        "generateJwt with RSA algorithm requires 'privateKey'"
      );
    const n = { alg: t.algorithm, typ: "JWT" }, a = Ee(JSON.stringify(n)), o = Math.floor(Date.now() / 1e3), i = {
      iat: o,
      exp: o + (t.expiresIn ?? 3600)
    };
    t.issuer && (i.iss = t.issuer), t.audience && (i.aud = t.audience);
    let l = {};
    t.claims && (l = typeof t.claims == "function" ? await t.claims(e) : t.claims);
    const c = { ...i, ...l }, u = Ee(JSON.stringify(c)), d = `${a}.${u}`, f = new TextEncoder(), h = f.encode(d), w = Ir(t.algorithm);
    let m;
    if ($e(t.algorithm)) {
      const x = await crypto.subtle.importKey(
        "raw",
        f.encode(t.secret),
        { name: "HMAC", hash: w },
        !1,
        ["sign"]
      );
      m = await crypto.subtle.sign("HMAC", x, h);
    } else {
      const x = await crypto.subtle.importKey(
        "jwk",
        t.privateKey,
        { name: "RSASSA-PKCS1-v1_5", hash: w },
        !1,
        ["sign"]
      );
      m = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", x, h);
    }
    const y = Mr(new Uint8Array(m)), g = `${d}.${y}`;
    s(`generated JWT (alg=${t.algorithm})`);
    const v = t.tokenPrefix ? `${t.tokenPrefix} ${g}` : g, b = new Headers(e.req.raw.headers);
    b.set(t.headerName, v), e.req.raw = new Request(e.req.raw, { headers: b }), await r();
  }
}), As = T({
  name: "jws",
  priority: S.AUTH,
  defaults: {
    headerName: "X-JWS-Signature",
    payloadSource: "embedded",
    forwardPayload: !1,
    forwardHeaderName: "X-JWS-Payload"
  },
  validate: (e) => {
    if (!e.secret && !e.jwksUrl)
      throw new p(
        500,
        "config_error",
        "jws requires either 'secret' or 'jwksUrl'"
      );
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = e.req.header(t.headerName);
    if (!n)
      throw new p(
        401,
        "jws_missing",
        `Missing JWS header: ${t.headerName}`
      );
    const a = n.split(".");
    if (a.length !== 3)
      throw new p(
        401,
        "jws_invalid",
        "Malformed JWS: expected 3 parts"
      );
    const [o, i, l] = a;
    let c;
    try {
      c = JSON.parse(W(o));
    } catch {
      throw new p(
        401,
        "jws_invalid",
        "Malformed JWS: invalid header encoding"
      );
    }
    if (c.alg.toLowerCase() === "none")
      throw new p(
        401,
        "jws_invalid",
        "JWS algorithm 'none' is not allowed"
      );
    let u;
    if (t.payloadSource === "body") {
      const w = await e.req.raw.clone().text(), m = new TextEncoder();
      u = Tr(m.encode(w));
    } else {
      if (!i)
        throw new p(
          401,
          "jws_invalid",
          "JWS has empty payload but payloadSource is 'embedded'"
        );
      u = i;
    }
    const d = new TextEncoder(), f = d.encode(`${o}.${u}`), h = Te(l);
    if (t.secret) {
      const w = ct(c.alg);
      if (!w)
        throw new p(
          401,
          "jws_invalid",
          `Unsupported JWS algorithm: ${c.alg}`
        );
      s(`HMAC verification (alg=${c.alg})`);
      const m = await crypto.subtle.importKey(
        "raw",
        d.encode(t.secret),
        { name: "HMAC", hash: w },
        !1,
        ["verify"]
      );
      if (!await crypto.subtle.verify(
        "HMAC",
        m,
        h,
        f
      ))
        throw new p(401, "jws_invalid", "Invalid JWS signature");
    } else if (t.jwksUrl) {
      const w = ut(c.alg);
      if (!w)
        throw new p(
          401,
          "jws_invalid",
          `Unsupported JWS algorithm: ${c.alg}`
        );
      const m = await dt(
        t.jwksUrl,
        t.jwksCacheTtlMs,
        t.jwksTimeoutMs
      ), y = c.kid ? m.find(
        (b) => b.kid === c.kid
      ) : m[0];
      if (!y)
        throw new p(
          401,
          "jws_invalid",
          "No matching JWKS key found"
        );
      s(
        `JWKS verification (alg=${c.alg}, kid=${c.kid ?? "none"})`
      );
      const g = await crypto.subtle.importKey(
        "jwk",
        y,
        w,
        !1,
        ["verify"]
      );
      if (!await crypto.subtle.verify(
        w,
        g,
        h,
        f
      ))
        throw new p(401, "jws_invalid", "Invalid JWS signature");
    }
    if (t.forwardPayload)
      try {
        const w = W(u), m = new Headers(e.req.raw.headers), y = w.replace(/[\r\n\0]/g, "");
        m.set(t.forwardHeaderName, y), e.req.raw = new Request(e.req.raw, { headers: m });
      } catch {
      }
    s("JWS verified"), await r();
  }
});
function Es(e) {
  if (!e.secret && !e.jwksUrl)
    throw new p(
      500,
      "config_error",
      "jwtAuth requires either 'secret' or 'jwksUrl'"
    );
  const r = e.headerName ?? "authorization", t = e.tokenPrefix ?? "Bearer", s = async (n, a) => {
    const o = O(n, "jwt-auth"), i = n.req.header(r);
    if (!i)
      throw new p(
        401,
        "unauthorized",
        "Missing authentication token"
      );
    let l;
    if (t) {
      if (!i.startsWith(`${t} `))
        throw new p(
          401,
          "unauthorized",
          `Expected ${t} token`
        );
      l = i.slice(t.length + 1);
    } else
      l = i;
    if (!l || !l.trim())
      throw new p(401, "unauthorized", "Empty authentication token");
    const c = l.split(".");
    if (c.length !== 3)
      throw new p(
        401,
        "unauthorized",
        "Malformed JWT: expected 3 parts"
      );
    let u, d;
    try {
      u = JSON.parse(W(c[0])), d = JSON.parse(W(c[1]));
    } catch {
      throw new p(
        401,
        "unauthorized",
        "Malformed JWT: invalid base64 encoding"
      );
    }
    if (u.alg.toLowerCase() === "none")
      throw new p(
        401,
        "unauthorized",
        "JWT algorithm 'none' is not allowed"
      );
    e.secret ? (o(`HMAC verification (alg=${u.alg})`), await Or(e.secret, c[0], c[1], c[2], u.alg)) : e.jwksUrl && (o(
      `JWKS verification (alg=${u.alg}, kid=${u.kid ?? "none"})`
    ), await kr(
      e.jwksUrl,
      c[0],
      c[1],
      c[2],
      u,
      e.jwksCacheTtlMs,
      e.jwksTimeoutMs
    ));
    const f = Math.floor(Date.now() / 1e3), h = e.clockSkewSeconds ?? 0;
    if (e.requireExp && d.exp === void 0)
      throw new p(
        401,
        "unauthorized",
        "JWT must contain an 'exp' claim"
      );
    if (d.exp !== void 0 && d.exp < f - h)
      throw new p(401, "unauthorized", "JWT has expired");
    if (e.issuer && d.iss !== e.issuer)
      throw new p(401, "unauthorized", "JWT issuer mismatch");
    if (e.audience && !(Array.isArray(d.aud) ? d.aud : [d.aud]).includes(e.audience))
      throw new p(401, "unauthorized", "JWT audience mismatch");
    if (o(`verified (sub=${d.sub ?? "none"})`), e.forwardClaims) {
      const w = new Headers(n.req.raw.headers);
      let m = !1;
      for (const [y, g] of Object.entries(e.forwardClaims)) {
        const v = d[y];
        if (v != null) {
          const b = String(v).replace(/[\r\n\0]/g, "");
          w.set(g, b), m = !0;
        }
      }
      m && (n.req.raw = new Request(n.req.raw, { headers: w }));
    }
    await a();
  };
  return {
    name: "jwt-auth",
    priority: S.AUTH,
    handler: C(e.skip, s)
  };
}
async function Or(e, r, t, s, n) {
  const a = ct(n);
  if (!a)
    throw new p(
      401,
      "unauthorized",
      `Unsupported JWT algorithm: ${n}`
    );
  const o = new TextEncoder(), i = await crypto.subtle.importKey(
    "raw",
    o.encode(e),
    { name: "HMAC", hash: a },
    !1,
    ["verify"]
  ), l = o.encode(`${r}.${t}`), c = Te(s);
  if (!await crypto.subtle.verify("HMAC", i, c, l))
    throw new p(401, "unauthorized", "Invalid JWT signature");
}
async function kr(e, r, t, s, n, a, o) {
  const i = await dt(e, a, o), l = n.kid ? i.find(
    (m) => m.kid === n.kid
  ) : i[0];
  if (!l)
    throw new p(401, "unauthorized", "No matching JWKS key found");
  const c = ut(n.alg);
  if (!c)
    throw new p(
      401,
      "unauthorized",
      `Unsupported JWT algorithm: ${n.alg}`
    );
  const u = await crypto.subtle.importKey(
    "jwk",
    l,
    c,
    !1,
    ["verify"]
  ), f = new TextEncoder().encode(`${r}.${t}`), h = Te(s);
  if (!await crypto.subtle.verify(c, u, h, f))
    throw new p(401, "unauthorized", "Invalid JWT signature");
}
var _e = /* @__PURE__ */ new Map(), $s = T({
  name: "oauth2",
  priority: S.AUTH,
  defaults: {
    tokenLocation: "header",
    headerName: "authorization",
    headerPrefix: "Bearer",
    queryParam: "access_token",
    cacheTtlSeconds: 0
  },
  validate: (e) => {
    if (!e.introspectionUrl && !e.localValidate)
      throw new p(
        500,
        "config_error",
        "oauth2 requires either introspectionUrl or localValidate"
      );
  },
  handler: async (e, r, { config: t, debug: s }) => {
    let n;
    if (t.tokenLocation === "query")
      n = e.req.query(t.queryParam) ?? void 0;
    else {
      const a = e.req.header(t.headerName);
      if (a && t.headerPrefix) {
        const o = `${t.headerPrefix} `;
        a.startsWith(o) ? n = a.slice(o.length) : n = void 0;
      } else
        n = a ?? void 0;
    }
    if (!n || !n.trim())
      throw new p(401, "unauthorized", "Missing access token");
    if (t.localValidate) {
      if (s("local validation"), !await t.localValidate(n))
        throw new p(401, "unauthorized", "Token validation failed");
    } else if (t.introspectionUrl) {
      s("introspection validation");
      const a = await jr(
        n,
        t.introspectionUrl,
        t.clientId,
        t.clientSecret,
        t.cacheTtlSeconds ?? 0,
        t.introspectionTimeoutMs
      );
      if (!a.active)
        throw new p(401, "unauthorized", "Token is not active");
      if (t.requiredScopes && t.requiredScopes.length > 0) {
        const o = a.scope ? a.scope.split(" ") : [];
        if (t.requiredScopes.filter(
          (l) => !o.includes(l)
        ).length > 0)
          throw new p(403, "forbidden", "Insufficient scope");
      }
      if (t.forwardTokenInfo) {
        const o = new Headers(e.req.raw.headers);
        let i = !1;
        for (const [l, c] of Object.entries(
          t.forwardTokenInfo
        )) {
          const u = a[l];
          if (u != null) {
            const d = String(u).replace(/[\r\n\0]/g, "");
            o.set(c, d), i = !0;
          }
        }
        i && (e.req.raw = new Request(e.req.raw, { headers: o }));
      }
    }
    await r();
  }
}), Pr = 5e3;
async function jr(e, r, t, s, n = 0, a) {
  if (n > 0) {
    const u = _e.get(e);
    if (u && u.expiresAt > Date.now())
      return u.result;
  }
  const o = {
    "content-type": "application/x-www-form-urlencoded"
  };
  t && s && (o.authorization = `Basic ${btoa(`${t}:${s}`)}`);
  const i = a ?? Pr;
  let l;
  try {
    l = await fetch(r, {
      method: "POST",
      headers: o,
      body: `token=${encodeURIComponent(e)}`,
      signal: AbortSignal.timeout(i)
    });
  } catch (u) {
    throw u instanceof DOMException && u.name === "TimeoutError" ? new p(
      502,
      "introspection_error",
      `Introspection endpoint timed out after ${i}ms`
    ) : new p(
      502,
      "introspection_error",
      `Introspection endpoint error: ${u instanceof Error ? u.message : String(u)}`
    );
  }
  if (!l.ok)
    throw new p(
      502,
      "introspection_error",
      `Introspection endpoint returned ${l.status}`
    );
  const c = await l.json();
  return n > 0 && _e.set(e, {
    result: c,
    expiresAt: Date.now() + n * 1e3
  }), c;
}
var _s = T({
  name: "rbac",
  priority: S.AUTH,
  defaults: {
    roleHeader: "x-user-role",
    permissionHeader: "x-user-permissions",
    permissionDelimiter: ",",
    roleDelimiter: ",",
    denyMessage: "Access denied: insufficient permissions"
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = t.roles && t.roles.length > 0, a = t.permissions && t.permissions.length > 0;
    if (!n && !a) {
      s("no roles or permissions configured, passing through"), await r();
      return;
    }
    if (n) {
      const o = e.req.header(t.roleHeader) ?? "", i = o ? o.split(t.roleDelimiter).map((c) => c.trim()) : [];
      if (s(
        `checking roles: user=${i.join(",")} required=${t.roles.join(",")}`
      ), !t.roles.some(
        (c) => i.includes(c)
      ))
        throw new p(403, "forbidden", t.denyMessage);
    }
    if (a) {
      const o = e.req.header(t.permissionHeader) ?? "", i = o ? o.split(t.permissionDelimiter).map((c) => c.trim()) : [];
      if (s(
        `checking permissions: user=${i.join(",")} required=${t.permissions.join(",")}`
      ), !t.permissions.every(
        (c) => i.includes(c)
      ))
        throw new p(403, "forbidden", t.denyMessage);
    }
    await r();
  }
}), Hs = T({
  name: "verify-http-signature",
  priority: S.AUTH,
  defaults: {
    requiredComponents: ["@method"],
    maxAge: 300,
    signatureHeaderName: "Signature",
    signatureInputHeaderName: "Signature-Input",
    label: "sig1"
  },
  handler: async (e, r, { config: t, debug: s }) => {
    if (!t.keys || Object.keys(t.keys).length === 0)
      throw new p(
        500,
        "config_error",
        "verifyHttpSignature requires at least one key in 'keys'"
      );
    const n = t.label, a = e.req.header(t.signatureInputHeaderName);
    if (!a)
      throw new p(
        401,
        "signature_invalid",
        "Missing Signature-Input header"
      );
    const o = e.req.header(t.signatureHeaderName);
    if (!o)
      throw new p(
        401,
        "signature_invalid",
        "Missing Signature header"
      );
    const i = `${n}=`;
    if (!a.startsWith(i))
      throw new p(
        401,
        "signature_invalid",
        `Missing signature label "${n}" in Signature-Input header`
      );
    const l = a.slice(i.length), { components: c, params: u } = $r(l);
    s(`verifying label=${n}, components=${c.join(",")}`);
    const d = `${n}=:`;
    if (!o.startsWith(d) || !o.endsWith(":"))
      throw new p(
        401,
        "signature_invalid",
        `Invalid Signature header format for label "${n}"`
      );
    const f = o.slice(d.length, -1), h = Math.floor(Date.now() / 1e3);
    if (u.created && Number.parseInt(u.created, 10) + t.maxAge < h)
      throw new p(
        401,
        "signature_invalid",
        "Signature has expired (maxAge exceeded)"
      );
    if (u.expires && Number.parseInt(u.expires, 10) < h)
      throw new p(
        401,
        "signature_invalid",
        "Signature has expired (expires parameter)"
      );
    for (const $ of t.requiredComponents)
      if (!c.includes($))
        throw new p(
          401,
          "signature_invalid",
          `Required component "${$}" not found in signature`
        );
    const w = u.keyid;
    if (!w)
      throw new p(
        401,
        "signature_invalid",
        "Missing keyid in signature parameters"
      );
    const m = t.keys[w];
    if (!m)
      throw new p(
        401,
        "signature_invalid",
        "Unknown key identifier"
      );
    const g = ht(
      c,
      l,
      e.req.raw
    ), v = await Hr(
      m.algorithm,
      m.secret,
      m.publicKey
    ), { signAlg: b } = se(m.algorithm), x = new TextEncoder(), A = Cr(f);
    if (!await crypto.subtle.verify(
      b,
      v,
      A,
      x.encode(g)
    ))
      throw new p(
        401,
        "signature_invalid",
        "Signature verification failed"
      );
    s("signature verified successfully"), await r();
  }
}), qs = T({
  name: "dynamic-routing",
  priority: S.REQUEST_TRANSFORM,
  defaults: { fallthrough: !0 },
  handler: async (e, r, { config: t, debug: s }) => {
    for (const n of t.rules)
      if (await n.condition(e)) {
        s(
          `matched rule ${n.name ? `"${n.name}"` : "(unnamed)"} → target=${n.target}`
        ), e.set("_dynamicTarget", n.target), n.rewritePath && e.set("_dynamicRewrite", n.rewritePath), n.headers && e.set("_dynamicHeaders", n.headers), await r();
        return;
      }
    if (!t.fallthrough)
      throw new p(404, "no_route", "No routing rule matched");
    s("no rule matched, falling through"), await r();
  }
});
function Cs(e) {
  const r = k(
    { mode: "deny", countryHeader: "cf-ipcountry" },
    e
  ), t = new Set(
    (r.allow ?? []).map((a) => a.toUpperCase())
  ), s = new Set(
    (r.deny ?? []).map((a) => a.toUpperCase())
  ), n = async (a, o) => {
    const i = O(a, "geo-ip-filter"), l = a.req.header(r.countryHeader)?.toUpperCase(), c = r.mode;
    if (i(`country=${l ?? "unknown"} mode=${c}`), c === "allow") {
      if (!l || !t.has(l))
        throw new p(
          403,
          "geo_denied",
          "Access denied from this region"
        );
    } else if (l && s.has(l))
      throw new p(
        403,
        "geo_denied",
        "Access denied from this region"
      );
    await o();
  };
  return {
    name: "geo-ip-filter",
    priority: S.IP_FILTER,
    handler: C(e?.skip, n)
  };
}
var Ms = T({
  name: "http-callout",
  priority: S.REQUEST_TRANSFORM,
  defaults: { method: "GET", timeout: 5e3, abortOnFailure: !0 },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = typeof t.url == "function" ? await t.url(e) : t.url, a = {};
    if (t.headers)
      for (const [l, c] of Object.entries(t.headers))
        a[l] = typeof c == "function" ? await c(e) : c;
    let o;
    if (t.body !== void 0) {
      const l = typeof t.body == "function" ? await t.body(e) : t.body;
      l != null && (o = typeof l == "string" ? l : JSON.stringify(l), typeof l != "string" && !a["content-type"] && (a["content-type"] = "application/json"));
    }
    s(`${t.method} ${n}`);
    let i;
    try {
      i = await fetch(n, {
        method: t.method,
        headers: a,
        body: o,
        signal: AbortSignal.timeout(t.timeout)
      });
    } catch (l) {
      if (t.onError) {
        await t.onError(l, e), await r();
        return;
      }
      throw new p(
        502,
        "callout_failed",
        `External callout failed: ${l instanceof Error ? l.message : String(l)}`
      );
    }
    if (!i.ok && t.abortOnFailure) {
      if (t.onError) {
        await t.onError(
          new Error(`External callout returned ${i.status}`),
          e
        ), await r();
        return;
      }
      throw new p(
        502,
        "callout_failed",
        `External callout returned ${i.status}`
      );
    }
    await t.onResponse(i, e), await r();
  }
}), Is = T({
  name: "interrupt",
  priority: S.DEFAULT,
  defaults: { statusCode: 200, headers: {} },
  handler: async (e, r, { config: t, debug: s }) => {
    if (!await t.condition(e)) {
      s("condition false, continuing pipeline"), await r();
      return;
    }
    s("condition true, short-circuiting");
    const a = new Headers(t.headers);
    let o = null;
    t.body === void 0 || t.body === null || (typeof t.body == "string" ? (o = t.body, a.has("content-type") || a.set("content-type", "text/plain")) : (o = JSON.stringify(t.body), a.has("content-type") || a.set("content-type", "application/json"))), e.res = new Response(o, {
      status: t.statusCode,
      headers: a
    });
  }
});
function me(e) {
  const r = e.split(".");
  if (r.length !== 4) return -1;
  let t = 0;
  for (const s of r) {
    const n = Number(s);
    if (Number.isNaN(n) || n < 0 || n > 255) return -1;
    t = t << 8 | n;
  }
  return t >>> 0;
}
function He(e) {
  const r = e.indexOf("/");
  if (r === -1) {
    const a = me(e);
    return a === -1 ? null : { network: a, mask: 4294967295 };
  }
  const t = me(e.slice(0, r)), s = Number(e.slice(r + 1));
  if (t === -1 || Number.isNaN(s) || s < 0 || s > 32) return null;
  const n = s === 0 ? 0 : -1 << 32 - s >>> 0;
  return { network: (t & n) >>> 0, mask: n };
}
function qe(e, r) {
  const t = me(e);
  if (t === -1) return !1;
  for (const s of r)
    if ((t & s.mask) >>> 0 === s.network) return !0;
  return !1;
}
function Os(e) {
  const r = e.mode ?? "deny", t = e.ipHeaders, s = (e.allow ?? []).map(He).filter((i) => i !== null), n = (e.deny ?? []).map(He).filter((i) => i !== null);
  function a(i) {
    if (r === "allow") {
      if (!qe(i, s))
        return {
          action: "reject",
          status: 403,
          code: "ip_denied",
          message: "Access denied"
        };
    } else if (qe(i, n))
      return {
        action: "reject",
        status: 403,
        code: "ip_denied",
        message: "Access denied"
      };
    return { action: "continue" };
  }
  const o = async (i, l) => {
    const c = X(i.req.raw.headers, t), u = a(c);
    if (u.action === "reject")
      throw new p(u.status, u.code, u.message);
    await l();
  };
  return {
    name: "ip-filter",
    priority: S.IP_FILTER,
    handler: C(e.skip, o),
    phases: ["request-headers"],
    // ── Protocol-agnostic evaluator ────────────────────────────────
    evaluate: {
      onRequest: async (i) => {
        const l = i.clientIp ?? X(i.headers, t);
        return a(l);
      }
    }
  };
}
function we(e, r, t = 0) {
  if (t > r.maxDepth)
    throw new p(400, "json_threat", "JSON exceeds maximum depth");
  if (typeof e == "string" && e.length > r.maxStringLength)
    throw new p(
      400,
      "json_threat",
      "String value exceeds maximum length"
    );
  if (Array.isArray(e)) {
    if (e.length > r.maxArraySize)
      throw new p(400, "json_threat", "Array exceeds maximum size");
    for (const s of e)
      we(s, r, t + 1);
  } else if (e !== null && typeof e == "object") {
    const s = Object.keys(e);
    if (s.length > r.maxKeys)
      throw new p(
        400,
        "json_threat",
        "Object exceeds maximum key count"
      );
    for (const n of s) {
      if (n.length > r.maxStringLength)
        throw new p(
          400,
          "json_threat",
          "String value exceeds maximum length"
        );
      we(
        e[n],
        r,
        t + 1
      );
    }
  }
}
var ks = T({
  name: "json-threat-protection",
  priority: S.EARLY,
  defaults: {
    maxDepth: 20,
    maxKeys: 100,
    maxStringLength: 1e4,
    maxArraySize: 100,
    maxBodySize: 1048576,
    contentTypes: ["application/json"]
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = e.req.header("content-type") ?? "";
    if (!t.contentTypes.some(
      (u) => n.includes(u)
    )) {
      s("skipping — content type %s not inspected", n), await r();
      return;
    }
    const o = e.req.header("content-length");
    if (o !== void 0) {
      const u = Number.parseInt(o, 10);
      if (!Number.isNaN(u) && u > t.maxBodySize)
        throw s("body size %d exceeds max %d", u, t.maxBodySize), new p(
          413,
          "body_too_large",
          "Request body exceeds maximum size"
        );
    }
    const l = await e.req.raw.clone().text();
    if (!l) {
      s("empty body — passing through"), await r();
      return;
    }
    let c;
    try {
      c = JSON.parse(l);
    } catch {
      throw s("invalid JSON"), new p(
        400,
        "invalid_json",
        "Invalid JSON in request body"
      );
    }
    we(c, {
      maxDepth: t.maxDepth,
      maxKeys: t.maxKeys,
      maxStringLength: t.maxStringLength,
      maxArraySize: t.maxArraySize
    }), s("JSON structure validated"), await r();
  }
}), Ce = /* @__PURE__ */ new WeakMap();
function Nr(e, r) {
  let t = Ce.get(e);
  if (!t) {
    const s = r.replace(/g/g, "");
    s !== r && console.warn(
      "[stoma:regex-threat-protection] Stripped 'g' flag — not meaningful with .test()"
    ), t = e.map((n) => ({
      regex: new RegExp(n.regex, s),
      targets: n.targets,
      message: n.message ?? "Request blocked by threat protection"
    })), Ce.set(e, t);
  }
  return t;
}
var Ps = T({
  name: "regex-threat-protection",
  priority: S.EARLY,
  defaults: {
    patterns: [],
    flags: "i",
    contentTypes: ["application/json", "text/plain"],
    maxBodyScanLength: 65536
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = Nr(t.patterns, t.flags ?? "i");
    if (n.length === 0) {
      s("no patterns configured — passing through"), await r();
      return;
    }
    const a = n.some((i) => i.targets.includes("body"));
    let o = null;
    if (a) {
      const i = e.req.header("content-type") ?? "";
      if (t.contentTypes.some(
        (c) => i.includes(c)
      )) {
        const u = e.req.raw.clone().body?.getReader();
        if (u) {
          let d = "";
          const f = t.maxBodyScanLength;
          let h = !1;
          const w = new TextDecoder();
          for (; !h && d.length < f; ) {
            const m = await u.read();
            m.done ? h = !0 : d += w.decode(m.value, { stream: !0 });
          }
          u.cancel(), d.length > f && (d = d.slice(0, f)), o = d || null;
        }
      }
    }
    for (const i of n) {
      if (i.targets.includes("path") && i.regex.test(e.req.path))
        throw s("path matched pattern: %s", i.regex.source), new p(400, "threat_detected", i.message);
      if (i.targets.includes("query")) {
        const l = new URL(e.req.url), c = decodeURIComponent(l.search.slice(1));
        if (c && i.regex.test(c))
          throw s("query matched pattern: %s", i.regex.source), new p(400, "threat_detected", i.message);
      }
      if (i.targets.includes("headers")) {
        for (const [, l] of e.req.raw.headers.entries())
          if (i.regex.test(l))
            throw s("header matched pattern: %s", i.regex.source), new p(400, "threat_detected", i.message);
      }
      if (i.targets.includes("body") && o && i.regex.test(o))
        throw s("body matched pattern: %s", i.regex.source), new p(400, "threat_detected", i.message);
    }
    s("all patterns passed"), await r();
  }
}), js = T({
  name: "request-limit",
  priority: S.EARLY,
  defaults: {
    message: "Request body too large"
  },
  handler: async (e, r, { config: t }) => {
    const s = e.req.header("content-length");
    if (s !== void 0) {
      const n = Number.parseInt(s, 10);
      if (!Number.isNaN(n) && n > t.maxBytes)
        throw new p(413, "request_too_large", t.message);
    }
    await r();
  }
});
function Dr(e, r) {
  const t = r.split(".");
  let s = e;
  for (let n = 0; n < t.length - 1; n++) {
    if (s == null || typeof s != "object") return;
    s = s[t[n]];
  }
  s != null && typeof s == "object" && delete s[t[t.length - 1]];
}
function Ur(e, r) {
  const t = {};
  for (const s of r) {
    const n = s.split(".");
    let a = e, o = t;
    for (let i = 0; i < n.length && !(a == null || typeof a != "object"); i++)
      i === n.length - 1 ? n[i] in a && (o[n[i]] = a[n[i]]) : (n[i] in o || (o[n[i]] = {}), o = o[n[i]], a = a[n[i]]);
  }
  return t;
}
function Me(e, r, t) {
  if (r === "allow")
    return Ur(e, t);
  const s = structuredClone(e);
  for (const n of t)
    Dr(s, n);
  return s;
}
var Ns = T({
  name: "resource-filter",
  priority: S.RESPONSE_TRANSFORM,
  defaults: {
    contentTypes: ["application/json"],
    applyToArrayItems: !0
  },
  handler: async (e, r, { config: t, debug: s }) => {
    if (await r(), t.fields.length === 0) {
      s("no fields configured — passing through");
      return;
    }
    const n = e.res.headers.get("content-type") ?? "";
    if (!t.contentTypes.some(
      (l) => n.includes(l)
    )) {
      s(
        "skipping — response content type %s not in %o",
        n,
        t.contentTypes
      );
      return;
    }
    let o;
    try {
      const l = await e.res.text();
      o = JSON.parse(l);
    } catch {
      s("response body is not valid JSON — passing through");
      return;
    }
    let i;
    Array.isArray(o) ? t.applyToArrayItems ? i = o.map(
      (l) => l != null && typeof l == "object" ? Me(
        l,
        t.mode,
        t.fields
      ) : l
    ) : i = o : o != null && typeof o == "object" ? i = Me(
      o,
      t.mode,
      t.fields
    ) : i = o, s(
      "filtered response with mode=%s fields=%o",
      t.mode,
      t.fields
    ), e.res = new Response(JSON.stringify(i), {
      status: e.res.status,
      headers: e.res.headers
    });
  }
}), Ds = T({
  name: "ssl-enforce",
  priority: S.EARLY,
  defaults: {
    redirect: !0,
    hstsMaxAge: 31536e3,
    includeSubDomains: !1,
    preload: !1
  },
  handler: async (e, r, { config: t }) => {
    if (!((e.req.header("x-forwarded-proto") ?? new URL(e.req.url).protocol.replace(":", "")) === "https")) {
      if (t.redirect) {
        const o = new URL(e.req.url);
        o.protocol = "https:", e.res = new Response(null, {
          status: 301,
          headers: { Location: o.toString() }
        });
        return;
      }
      throw new p(403, "ssl_required", "HTTPS is required");
    }
    await r();
    let a = `max-age=${t.hstsMaxAge}`;
    t.includeSubDomains && (a += "; includeSubDomains"), t.preload && (a += "; preload"), e.res.headers.set("Strict-Transport-Security", a);
  }
}), Lr = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]), Us = T({
  name: "traffic-shadow",
  priority: S.RESPONSE_TRANSFORM,
  defaults: {
    target: "",
    percentage: 100,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    mirrorBody: !0,
    timeout: 5e3
  },
  handler: async (e, r, { config: t, debug: s }) => {
    let n = null;
    if (t.mirrorBody)
      try {
        n = await e.req.raw.clone().arrayBuffer(), n.byteLength === 0 && (n = null);
      } catch {
        n = null;
      }
    await r();
    const a = e.req.method.toUpperCase();
    if (!new Set(
      (t.methods ?? []).map((y) => y.toUpperCase())
    ).has(a)) {
      s("method %s not in shadow methods — skipping", a);
      return;
    }
    const i = Math.random() * 100;
    if (i >= (t.percentage ?? 100)) {
      s("rolled %.1f >= %d%% — skipping shadow", i, t.percentage);
      return;
    }
    const l = new URL(e.req.url), u = `${t.target.replace(/\/$/, "")}${l.pathname}${l.search}`, d = new Headers();
    for (const [y, g] of e.req.raw.headers.entries())
      Lr.has(y.toLowerCase()) || d.set(y, g);
    s("shadowing %s %s → %s", a, l.pathname, u);
    const f = new AbortController(), h = setTimeout(
      () => f.abort(),
      t.timeout ?? 5e3
    ), w = fetch(u, {
      method: a,
      headers: d,
      body: t.mirrorBody && n ? n : void 0,
      signal: f.signal,
      redirect: "manual"
    }).catch((y) => {
      s("shadow request failed: %s", String(y)), t.onError?.(y);
    }).finally(() => {
      clearTimeout(h);
    }), m = B(e);
    m?.adapter?.waitUntil && m.adapter.waitUntil(w);
  }
}), Ls = T({
  name: "latency-injection",
  priority: S.EARLY,
  defaults: { jitter: 0, probability: 1 },
  handler: async (e, r, { config: t, debug: s }) => {
    if (Math.random() >= t.probability) {
      s("skipping injection (probability miss)"), await r();
      return;
    }
    let n = t.delayMs;
    t.jitter > 0 && (n += (Math.random() * 2 - 1) * t.jitter * t.delayMs), n = Math.max(0, n), s(`injecting ${n.toFixed(0)}ms latency`), await new Promise((a) => setTimeout(a, n)), await r();
  }
}), Br = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
function Kr(e) {
  return new Promise((r) => setTimeout(r, e));
}
function Fr(e, r, t, s) {
  const n = Math.random() * t;
  return r === "fixed" ? t + n : Math.min(t * 2 ** e + n, s);
}
function Bs(e) {
  const r = k(
    {
      maxRetries: 3,
      retryOn: [502, 503, 504],
      backoff: "exponential",
      baseDelayMs: 200,
      maxDelayMs: 5e3,
      retryMethods: Br,
      retryCountHeader: "x-retry-count"
    },
    e
  ), t = async (s, n) => {
    const a = O(s, "retry"), o = s.req.method.toUpperCase();
    if (!r.retryMethods.includes(o)) {
      await n();
      return;
    }
    await n();
    const i = s.get("_proxyRequest");
    if (!i)
      return;
    let l = 0;
    for (let c = 0; c < r.maxRetries && r.retryOn.includes(s.res.status); c++) {
      const u = Fr(
        c,
        r.backoff,
        r.baseDelayMs,
        r.maxDelayMs
      );
      a(
        `attempt ${c + 1}/${r.maxRetries} failed (status=${s.res.status}), retrying in ${Math.round(u)}ms`
      ), await s.res.body?.cancel(), await Kr(u);
      const d = await fetch(i.clone());
      l = c + 1, s.res = new Response(d.body, {
        status: d.status,
        statusText: d.statusText,
        headers: new Headers(d.headers)
      });
    }
    l > 0 && s.res.headers.set(r.retryCountHeader, String(l));
  };
  return {
    name: "retry",
    priority: S.RETRY,
    handler: C(e?.skip, t)
  };
}
var Ks = T({
  name: "timeout",
  priority: S.TIMEOUT,
  defaults: { timeoutMs: 3e4, message: "Gateway timeout", statusCode: 504 },
  handler: async (e, r, { config: t, trace: s }) => {
    const n = new AbortController(), a = setTimeout(() => n.abort(), t.timeoutMs);
    e.set("_timeoutSignal", n.signal);
    try {
      const o = Date.now();
      await Promise.race([
        r(),
        new Promise((i, l) => {
          n.signal.addEventListener(
            "abort",
            () => l(
              new p(
                t.statusCode,
                "gateway_timeout",
                t.message
              )
            )
          );
        })
      ]), s("passed", {
        budgetMs: t.timeoutMs,
        elapsed: Date.now() - o
      });
    } catch (o) {
      throw o instanceof p && o.code === "gateway_timeout" && s("fired", { budgetMs: t.timeoutMs }), o;
    } finally {
      clearTimeout(a);
    }
  }
}), Fs = T({
  name: "assign-attributes",
  priority: S.REQUEST_TRANSFORM,
  handler: async (e, r, { config: t, debug: s }) => {
    for (const [n, a] of Object.entries(t.attributes))
      if (typeof a == "function") {
        const o = await a(e);
        e.set(n, o), s("set %s = %s (dynamic)", n, o);
      } else
        e.set(n, a), s("set %s = %s (static)", n, a);
    await r();
  }
});
async function Ie(e, r) {
  const t = {};
  for (const [s, n] of Object.entries(r))
    typeof n == "function" ? t[s] = await n(e) : t[s] = n;
  return t;
}
function Oe(e, r) {
  return e ? r.some((t) => e.includes(t)) : !1;
}
var Js = T({
  name: "assign-content",
  priority: S.REQUEST_TRANSFORM,
  defaults: {
    contentTypes: ["application/json"]
  },
  handler: async (e, r, { config: t, debug: s }) => {
    if (t.request) {
      const n = e.req.header("content-type");
      if (Oe(n, t.contentTypes)) {
        let a = {};
        try {
          const c = await e.req.raw.clone().text();
          c && (a = JSON.parse(c));
        } catch {
        }
        const o = await Ie(e, t.request);
        Object.assign(a, o), s(
          "assigned %d fields to request body",
          Object.keys(o).length
        );
        const i = new Request(e.req.url, {
          method: e.req.method,
          headers: e.req.raw.headers,
          body: JSON.stringify(a),
          // @ts-expect-error -- duplex required for streams in some runtimes
          duplex: "half"
        });
        Object.defineProperty(e.req, "raw", {
          value: i,
          configurable: !0
        });
      } else
        s(
          "request content-type %s not in allowed types — skipping request modification",
          n
        );
    }
    if (await r(), t.response) {
      const n = e.res.headers.get("content-type");
      if (Oe(n ?? void 0, t.contentTypes)) {
        let a = {};
        try {
          const l = await e.res.text();
          l && (a = JSON.parse(l));
        } catch {
        }
        const o = await Ie(e, t.response);
        Object.assign(a, o), s(
          "assigned %d fields to response body",
          Object.keys(o).length
        );
        const i = new Response(JSON.stringify(a), {
          status: e.res.status,
          headers: e.res.headers
        });
        e.res = i;
      } else
        s(
          "response content-type %s not in allowed types — skipping response modification",
          n
        );
    }
  }
});
function zs(e) {
  const r = e?.origins ?? "*", t = vr({
    origin: typeof r == "function" ? (s) => r(s) ? s : "" : r,
    allowMethods: e?.methods,
    allowHeaders: e?.allowHeaders,
    exposeHeaders: e?.exposeHeaders,
    maxAge: e?.maxAge,
    credentials: e?.credentials
  });
  return {
    name: "cors",
    priority: S.EARLY,
    handler: C(e?.skip, t)
  };
}
var Ws = T({
  name: "json-validation",
  priority: S.AUTH,
  defaults: {
    contentTypes: ["application/json"],
    rejectStatus: 422,
    errorDetail: !0
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = e.req.header("content-type") ?? "";
    if (!t.contentTypes.some(
      (l) => n.includes(l)
    )) {
      s(
        "skipping — content type %s not in %o",
        n,
        t.contentTypes
      ), await r();
      return;
    }
    let o;
    try {
      const c = await e.req.raw.clone().text();
      if (!c)
        throw s("empty body with JSON content type"), new p(
          t.rejectStatus,
          "validation_failed",
          "Request body is empty"
        );
      o = JSON.parse(c);
    } catch (l) {
      throw l instanceof p ? l : (s("body parse failed"), new p(
        t.rejectStatus,
        "validation_failed",
        "Request body is not valid JSON"
      ));
    }
    if (!t.validate) {
      s("no validator configured — JSON parsed successfully"), await r();
      return;
    }
    const i = await t.validate(o);
    if (!i.valid) {
      const l = t.errorDetail && i.errors && i.errors.length > 0 ? `Validation failed: ${i.errors.join("; ")}` : "Validation failed";
      throw s("validation failed: %s", l), new p(
        t.rejectStatus,
        "validation_failed",
        l
      );
    }
    s("validation passed"), await r();
  }
}), Vs = T({
  name: "override-method",
  priority: S.EARLY,
  defaults: {
    header: "X-HTTP-Method-Override",
    allowedMethods: ["GET", "PUT", "PATCH", "DELETE"]
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = e.req.header(t.header);
    if (!n) {
      await r();
      return;
    }
    if (e.req.method !== "POST") {
      s(`ignoring override on ${e.req.method} request`), await r();
      return;
    }
    const a = n.toUpperCase();
    if (!new Set(
      (t.allowedMethods ?? []).map((l) => l.toUpperCase())
    ).has(a))
      throw new p(
        400,
        "invalid_method_override",
        `Method override not allowed: ${a}`
      );
    s(`overriding POST → ${a}`);
    const i = new Request(e.req.url, {
      method: a,
      headers: e.req.raw.headers,
      body: e.req.raw.body,
      // @ts-expect-error -- duplex is required for streams but not in all type definitions
      duplex: "half"
    });
    Object.defineProperty(e.req, "raw", { value: i, configurable: !0 }), await r();
  }
});
function Jr(e) {
  return typeof e == "boolean" ? { valid: e } : e;
}
var Ys = T({
  name: "request-validation",
  priority: S.AUTH,
  defaults: {
    contentTypes: ["application/json"],
    errorMessage: "Request validation failed"
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = e.req.header("content-type") ?? "";
    if (!t.contentTypes.some(
      (u) => n.includes(u)
    )) {
      s(
        "skipping — content type %s not in %o",
        n,
        t.contentTypes
      ), await r();
      return;
    }
    let o;
    try {
      const d = await e.req.raw.clone().text();
      o = JSON.parse(d);
    } catch {
      throw s("body parse failed"), new p(
        400,
        "validation_failed",
        `${t.errorMessage}: invalid JSON`
      );
    }
    const i = t.validateAsync ?? t.validate;
    if (!i) {
      s("no validator configured — passing through"), await r();
      return;
    }
    const l = await i(o), c = Jr(l);
    if (!c.valid) {
      const u = c.errors && c.errors.length > 0 ? `${t.errorMessage}: ${c.errors.join("; ")}` : t.errorMessage;
      throw s("validation failed: %s", u), new p(400, "validation_failed", u);
    }
    s("validation passed"), await r();
  }
}), Gs = T({
  name: "request-transform",
  priority: S.REQUEST_TRANSFORM,
  handler: async (e, r, { config: t }) => {
    const s = new Headers(e.req.raw.headers);
    if (t.renameHeaders)
      for (const [n, a] of Object.entries(t.renameHeaders)) {
        const o = s.get(n);
        o !== null && (s.set(a, o), s.delete(n));
      }
    if (t.setHeaders)
      for (const [n, a] of Object.entries(t.setHeaders))
        s.set(n, a);
    if (t.removeHeaders)
      for (const n of t.removeHeaders)
        s.delete(n);
    e.req.raw = new Request(e.req.raw, { headers: s }), await r();
  }
}), Xs = T({
  name: "response-transform",
  priority: S.RESPONSE_TRANSFORM,
  handler: async (e, r, { config: t }) => {
    if (await r(), t.renameHeaders)
      for (const [s, n] of Object.entries(t.renameHeaders)) {
        const a = e.res.headers.get(s);
        a !== null && (e.res.headers.set(n, a), e.res.headers.delete(s));
      }
    if (t.setHeaders)
      for (const [s, n] of Object.entries(t.setHeaders))
        e.res.headers.set(s, n);
    if (t.removeHeaders)
      for (const s of t.removeHeaders)
        e.res.headers.delete(s);
  }
});
function Qs(e) {
  const r = e?.path ?? "/health", t = e?.upstreamProbes ?? [], s = e?.includeUpstreamStatus ?? !1, n = e?.probeTimeoutMs ?? 5e3, a = e?.probeMethod ?? "HEAD", o = e?.unhealthyStatusCode ?? 503;
  return {
    path: r,
    methods: ["GET"],
    pipeline: {
      upstream: {
        type: "handler",
        handler: async (i) => {
          if (t.length === 0)
            return i.json({
              status: "healthy",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            });
          const l = await Promise.all(
            t.map(async (h) => {
              const w = Date.now();
              try {
                const m = await fetch(h, {
                  method: a,
                  signal: AbortSignal.timeout(n)
                });
                return {
                  url: h,
                  status: m.ok ? "healthy" : "unhealthy",
                  latencyMs: Date.now() - w
                };
              } catch {
                return {
                  url: h,
                  status: "unhealthy",
                  latencyMs: Date.now() - w
                };
              }
            })
          ), c = l.every((h) => h.status === "healthy"), u = l.every((h) => h.status === "unhealthy"), d = c ? "healthy" : u ? "unhealthy" : "degraded", f = {
            status: d,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
          return s && (f.upstreams = l), i.json(
            f,
            d === "unhealthy" ? o : 200
          );
        }
      }
    }
  };
}
var Zs = T({
  name: "assign-metrics",
  priority: S.OBSERVABILITY,
  handler: async (e, r, { config: t, debug: s }) => {
    const n = {};
    for (const [a, o] of Object.entries(t.tags))
      typeof o == "function" ? (n[a] = await E(
        () => Promise.resolve(o(e)),
        "unknown",
        s,
        `tag resolver(${a})`
      ), s("tag %s = %s (dynamic)", a, n[a])) : (n[a] = o, s("tag %s = %s (static)", a, o));
    e.set("_metricsTags", n), await r();
  }
}), en = T({
  name: "metrics-reporter",
  priority: S.METRICS,
  handler: async (e, r, { config: t, debug: s, gateway: n }) => {
    const a = Date.now();
    await r(), await E(
      async () => {
        const o = e.get("_metricsTags"), i = {};
        if (o)
          for (const [f, h] of Object.entries(o))
            typeof h == "string" && (i[f] = h);
        const l = new URL(e.req.url), c = {
          ...i,
          method: e.req.method,
          path: n?.routePath ?? l.pathname,
          status: String(e.res.status),
          gateway: n?.gatewayName ?? "unknown"
        };
        t.collector.increment("gateway_requests_total", 1, c);
        const u = Date.now() - a;
        t.collector.histogram(
          "gateway_request_duration_ms",
          u,
          c
        ), e.res.status >= 400 && t.collector.increment("gateway_request_errors_total", 1, c);
        const d = e.get("_policyTimings");
        if (d)
          for (const f of d)
            t.collector.histogram(
              "gateway_policy_duration_ms",
              f.durationMs,
              {
                ...i,
                policy: f.name,
                gateway: n?.gatewayName ?? "unknown"
              }
            );
      },
      void 0,
      s,
      "collector"
    );
  }
});
function pt(e, r) {
  if (!ft(e) && !Array.isArray(e))
    return e;
  const t = r.replacement ?? "[REDACTED]", s = structuredClone(e);
  for (const n of r.paths)
    Y(s, n.split("."), 0, t);
  return s;
}
function Y(e, r, t, s) {
  if (t >= r.length || e == null) return;
  const n = r[t], a = t === r.length - 1;
  if (Array.isArray(e)) {
    for (const o of e)
      Y(o, r, t, s);
    return;
  }
  if (ft(e))
    if (n === "*")
      for (const o of Object.keys(e))
        a ? e[o] = s : Y(
          e[o],
          r,
          t + 1,
          s
        );
    else {
      const o = e;
      if (!(n in o)) return;
      a ? o[n] = s : Y(o[n], r, t + 1, s);
    }
}
function ft(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
var zr = 8192, tn = T({
  name: "request-log",
  priority: S.OBSERVABILITY,
  handler: async (e, r, { config: t, debug: s, gateway: n }) => {
    const a = t.sink ?? Yr, o = t.maxBodyLength ?? zr, i = Date.now();
    let l;
    t.logRequestBody && (l = await Wr(
      e.req.raw,
      o,
      t.redactPaths
    )), await r();
    const c = new URL(e.req.url), u = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: n?.requestId ?? e.res.headers.get("x-request-id") ?? "unknown",
      method: e.req.method,
      path: c.pathname,
      statusCode: e.res.status,
      durationMs: Date.now() - i,
      clientIp: X(e.req.raw.headers, t.ipHeaders),
      userAgent: e.req.header("user-agent") ?? "unknown",
      gatewayName: n?.gatewayName ?? "unknown",
      routePath: n?.routePath ?? c.pathname,
      upstream: "unknown",
      // Enriched by proxy policy in future
      traceId: n?.traceId,
      spanId: n?.spanId
    };
    if (l !== void 0 && (u.requestBody = l), t.logResponseBody) {
      const d = await Vr(
        e,
        o,
        t.redactPaths
      );
      d !== void 0 && (u.responseBody = d);
    }
    if (t.extractFields)
      try {
        u.extra = t.extractFields(e);
      } catch {
      }
    await E(
      () => Promise.resolve(a(u)),
      void 0,
      s,
      "sink()"
    );
  }
});
async function Wr(e, r, t) {
  try {
    const n = await e.clone().text();
    if (!n) return;
    const a = n.length > r ? `${n.slice(0, r)}...[truncated]` : n;
    if ((e.headers.get("content-type") ?? "").includes("application/json"))
      try {
        let i = JSON.parse(
          a.endsWith("...[truncated]") ? n.slice(0, r) : n
        );
        return t?.length && (i = pt(i, { paths: t })), i;
      } catch {
        return a;
      }
    return a;
  } catch {
    return;
  }
}
async function Vr(e, r, t) {
  try {
    const n = await e.res.clone().text();
    if (!n) return;
    const a = n.length > r ? `${n.slice(0, r)}...[truncated]` : n;
    if ((e.res.headers.get("content-type") ?? "").includes("application/json"))
      try {
        let i = JSON.parse(
          a.endsWith("...[truncated]") ? n.slice(0, r) : n
        );
        return t?.length && (i = pt(i, { paths: t })), i;
      } catch {
        return a;
      }
    return a;
  } catch {
    return;
  }
}
function Yr(e) {
  console.log(JSON.stringify(e));
}
function Gr(e) {
  return e.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function ke(e, r, t, s) {
  const n = Gr(e), a = r.toFixed(t), o = s?.(e);
  if (o) {
    const i = o.replace(/"/g, '\\"');
    return `${n};dur=${a};desc="${i}"`;
  }
  return `${n};dur=${a}`;
}
var rn = T({
  name: "server-timing",
  priority: S.METRICS,
  defaults: {
    serverTimingHeader: !0,
    responseTimeHeader: !0,
    precision: 1,
    includeTotal: !0,
    visibility: "debug-only"
  },
  validate: (e) => {
    if (e.visibility === "conditional" && typeof e.visibilityFn != "function")
      throw new p(
        500,
        "config-error",
        'serverTiming: visibility "conditional" requires a visibilityFn'
      );
  },
  handler: async (e, r, { config: t, debug: s }) => {
    const n = Date.now();
    await r();
    let a;
    switch (t.visibility) {
      case "always":
        a = !0;
        break;
      case "conditional":
        a = await t.visibilityFn(e);
        break;
      default:
        a = ot(e);
        break;
    }
    if (!a) {
      s("skipping — visibility check failed");
      return;
    }
    const o = Date.now() - n, i = t.precision, l = e.get("_policyTimings"), c = l ? et(l) : void 0;
    if (t.serverTimingHeader) {
      const u = [];
      if (t.includeTotal && u.push(
        ke("total", o, i, t.descriptionFn)
      ), c)
        for (const d of c)
          u.push(
            ke(d.name, d.durationMs, i, t.descriptionFn)
          );
      u.length > 0 && (e.res.headers.set("server-timing", u.join(", ")), s("Server-Timing: %s", u.join(", ")));
    }
    if (t.responseTimeHeader) {
      const u = `${o.toFixed(i)}ms`;
      e.res.headers.set("x-response-time", u), s("X-Response-Time: %s", u);
    }
  }
});
function mt() {
  return {
    state: "closed",
    failureCount: 0,
    successCount: 0,
    lastFailureTime: 0,
    lastStateChange: Date.now()
  };
}
var wt = class {
  circuits = /* @__PURE__ */ new Map();
  getOrCreate(e) {
    let r = this.circuits.get(e);
    return r || (r = mt(), this.circuits.set(e, r)), r;
  }
  async getState(e) {
    return { ...this.getOrCreate(e) };
  }
  async recordSuccess(e) {
    const r = this.getOrCreate(e);
    return r.successCount++, { ...r };
  }
  async recordFailure(e) {
    const r = this.getOrCreate(e);
    return r.failureCount++, r.lastFailureTime = Date.now(), { ...r };
  }
  async transition(e, r) {
    const t = this.getOrCreate(e);
    return t.state = r, t.lastStateChange = Date.now(), r === "closed" && (t.failureCount = 0, t.successCount = 0), r === "half-open" && (t.successCount = 0), { ...t };
  }
  async reset(e) {
    this.circuits.delete(e);
  }
  /** Remove all circuits (for testing) */
  clear() {
    this.circuits.clear();
  }
};
async function j(e, r, t, s, n, a) {
  await E(
    () => e.transition(r, s),
    void 0,
    a,
    "store.transition()"
  ), n && await E(
    () => Promise.resolve(n(r, t, s)),
    void 0,
    a,
    "onStateChange()"
  );
}
function sn(e) {
  const r = k(
    {
      failureThreshold: 5,
      resetTimeoutMs: 3e4,
      halfOpenMax: 1,
      failureOn: [500, 502, 503, 504],
      openStatusCode: 503
    },
    e
  );
  let t = e?.store;
  t || (t = new wt());
  const s = t, n = e?.onStateChange, a = /* @__PURE__ */ new Map(), o = async (i, l) => {
    const c = O(i, "circuit-breaker"), u = e?.key ? e.key(i) : new URL(i.req.url).pathname, d = await E(
      () => s.getState(u),
      mt(),
      c,
      "store.getState()"
    ), f = Date.now();
    if (_(i, "x-stoma-circuit-key", u), _(i, "x-stoma-circuit-state", d.state), _(i, "x-stoma-circuit-failures", d.failureCount), d.state === "open")
      if (f - d.lastStateChange >= r.resetTimeoutMs)
        c(`open -> half-open (key=${u})`), await j(
          s,
          u,
          "open",
          "half-open",
          n,
          c
        ), a.set(u, 0);
      else {
        const h = Math.ceil(
          (r.resetTimeoutMs - (f - d.lastStateChange)) / 1e3
        );
        throw new p(
          r.openStatusCode,
          "circuit_open",
          "Service temporarily unavailable",
          { "retry-after": String(h) }
        );
      }
    if (d.state === "half-open" || d.state === "open" && f - d.lastStateChange >= r.resetTimeoutMs) {
      const h = a.get(u) ?? 0;
      if (h >= r.halfOpenMax)
        throw new p(
          r.openStatusCode,
          "circuit_open",
          "Service temporarily unavailable",
          { "retry-after": String(Math.ceil(r.resetTimeoutMs / 1e3)) }
        );
      a.set(u, h + 1);
      try {
        await l(), r.failureOn.includes(i.res.status) ? (c(
          `half-open probe failed (key=${u}, status=${i.res.status}) -> open`
        ), await E(
          () => s.recordFailure(u),
          void 0,
          c,
          "store.recordFailure()"
        ), await j(
          s,
          u,
          "half-open",
          "open",
          n,
          c
        )) : (c(`half-open probe succeeded (key=${u}) -> closed`), await E(
          () => s.recordSuccess(u),
          void 0,
          c,
          "store.recordSuccess()"
        ), await j(
          s,
          u,
          "half-open",
          "closed",
          n,
          c
        ), a.delete(u));
      } catch (w) {
        throw c(`half-open probe threw (key=${u}) -> open`), await E(
          () => s.recordFailure(u),
          void 0,
          c,
          "store.recordFailure()"
        ), await j(
          s,
          u,
          "half-open",
          "open",
          n,
          c
        ), w;
      } finally {
        const w = a.get(u) ?? 1;
        w <= 1 ? a.delete(u) : a.set(u, w - 1);
      }
      return;
    }
    try {
      await l();
    } catch (h) {
      const w = await E(
        () => s.recordFailure(u),
        null,
        c,
        "store.recordFailure()"
      );
      throw w && w.failureCount >= r.failureThreshold && (c(
        `closed -> open (key=${u}, failures=${w.failureCount}/${r.failureThreshold})`
      ), await j(
        s,
        u,
        "closed",
        "open",
        n,
        c
      )), h;
    }
    if (r.failureOn.includes(i.res.status)) {
      const h = await E(
        () => s.recordFailure(u),
        null,
        c,
        "store.recordFailure()"
      );
      h && h.failureCount >= r.failureThreshold && (c(
        `closed -> open (key=${u}, failures=${h.failureCount}/${r.failureThreshold})`
      ), await j(
        s,
        u,
        "closed",
        "open",
        n,
        c
      ));
    } else
      await E(
        () => s.recordSuccess(u),
        void 0,
        c,
        "store.recordSuccess()"
      );
  };
  return {
    name: "circuit-breaker",
    priority: S.CIRCUIT_BREAKER,
    handler: C(e?.skip, o)
  };
}
function le(e) {
  return !e || Object.keys(e).length === 0 ? "" : Object.entries(e).sort(([r], [t]) => r.localeCompare(t)).map(([r, t]) => `${r}=${t}`).join(",");
}
var nn = class {
  counters = /* @__PURE__ */ new Map();
  histograms = /* @__PURE__ */ new Map();
  gauges = /* @__PURE__ */ new Map();
  increment(e, r = 1, t) {
    const s = le(t);
    let n = this.counters.get(e);
    n || (n = /* @__PURE__ */ new Map(), this.counters.set(e, n));
    const a = n.get(s);
    a ? a.value += r : n.set(s, { value: r, tags: t });
  }
  histogram(e, r, t) {
    const s = le(t);
    let n = this.histograms.get(e);
    n || (n = /* @__PURE__ */ new Map(), this.histograms.set(e, n));
    const a = n.get(s);
    a ? a.values.push(r) : n.set(s, { values: [r], tags: t });
  }
  gauge(e, r, t) {
    const s = le(t);
    let n = this.gauges.get(e);
    n || (n = /* @__PURE__ */ new Map(), this.gauges.set(e, n)), n.set(s, { value: r, tags: t });
  }
  snapshot() {
    const e = {
      counters: {},
      histograms: {},
      gauges: {}
    };
    for (const [r, t] of this.counters)
      e.counters[r] = Array.from(t.values());
    for (const [r, t] of this.histograms)
      e.histograms[r] = Array.from(t.values());
    for (const [r, t] of this.gauges)
      e.gauges[r] = Array.from(t.values());
    return e;
  }
  reset() {
    this.counters.clear(), this.histograms.clear(), this.gauges.clear();
  }
};
function Xr(e) {
  const r = [];
  for (const [t, s] of Object.entries(e.counters)) {
    r.push(`# TYPE ${t} counter`);
    for (const n of s)
      r.push(`${t}${ce(n.tags)} ${n.value}`);
  }
  for (const [t, s] of Object.entries(e.histograms)) {
    r.push(`# TYPE ${t} histogram`);
    for (const n of s) {
      const a = ce(n.tags), o = n.values.reduce((l, c) => l + c, 0), i = n.values.length;
      r.push(`${t}_sum${a} ${o}`), r.push(`${t}_count${a} ${i}`);
    }
  }
  for (const [t, s] of Object.entries(e.gauges)) {
    r.push(`# TYPE ${t} gauge`);
    for (const n of s)
      r.push(`${t}${ce(n.tags)} ${n.value}`);
  }
  return r.join(`
`);
}
function Qr(e) {
  return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}
function ce(e) {
  return !e || Object.keys(e).length === 0 ? "" : `{${Object.entries(e).sort(([t], [s]) => t.localeCompare(s)).map(([t, s]) => `${t}="${Qr(s)}"`).join(",")}}`;
}
var Zr = ["secret", "key", "token", "password", "credential"];
function es(e, r, t) {
  const s = `/${r.prefix ?? "___gateway"}`, n = async (a, o) => {
    if (r.auth && !await r.auth(a))
      return a.json(
        { error: "unauthorized", message: "Admin access denied" },
        403
      );
    await o();
  };
  e.get(`${s}/routes`, n, (a) => a.json({
    gateway: t.gatewayName,
    routes: t.routes
  })), e.get(`${s}/policies`, n, (a) => a.json({
    gateway: t.gatewayName,
    policies: t.policies
  })), e.get(`${s}/config`, n, (a) => a.json(
    ye({
      gateway: t.gatewayName,
      routes: t.routes,
      policies: t.policies
    })
  )), e.get(`${s}/metrics`, n, (a) => {
    if (!r.metrics)
      return a.json(
        {
          error: "not_configured",
          message: "No metrics collector configured. Pass a MetricsCollector to admin.metrics."
        },
        404
      );
    const o = r.metrics.snapshot(), i = Xr(o);
    return a.text(i, 200, {
      "content-type": "text/plain; version=0.0.4; charset=utf-8"
    });
  }), e.get(`${s}/health`, n, (a) => a.json({
    status: "healthy",
    gateway: t.gatewayName,
    routeCount: t.routes.length,
    policyCount: t.policies.length,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }));
}
function ye(e) {
  if (typeof e != "object" || e === null) return e;
  if (Array.isArray(e)) return e.map(ye);
  const r = {};
  for (const [t, s] of Object.entries(e))
    Zr.some((n) => t.toLowerCase().includes(n)) ? r[t] = "[REDACTED]" : typeof s == "function" ? r[t] = "[Function]" : typeof s == "object" && s !== null ? r[t] = ye(s) : r[t] = s;
  return r;
}
function an(e) {
  if (!e.routes || e.routes.length === 0)
    throw new p(
      500,
      "config_error",
      "Gateway requires at least one route"
    );
  const r = e.name ?? "edge-gateway", t = lr(e.debug), s = t("stoma:gateway"), n = t("stoma:pipeline"), a = t("stoma:upstream"), o = new Qe();
  o.onError((d, f) => {
    if (e.onError)
      return e.onError(d, f);
    const h = B(f);
    return d instanceof p ? je(d, h?.requestId) : (console.error(
      `[${r}] Unhandled error on ${f.req.method} ${f.req.path}:`,
      d
    ), St(h?.requestId, e.defaultErrorMessage));
  }), o.notFound((d) => (s(`no route matches ${d.req.method} ${d.req.path}`), d.json(
    {
      error: "not_found",
      message: `No route matches ${d.req.method} ${d.req.path}`,
      statusCode: 404,
      gateway: r
    },
    404
  )));
  let i = 0;
  const l = [], c = /* @__PURE__ */ new Map();
  for (const d of e.routes) {
    const f = ts(e.basePath, d.path), h = st(
      r,
      d.path,
      t,
      e.requestIdHeader,
      e.adapter,
      e.debugHeaders,
      e.tracing
    ), w = pr(
      e.policies ?? [],
      d.pipeline.policies ?? [],
      n,
      e.defaultPolicyPriority
    ), m = fr(w), y = rs(
      d,
      a,
      e.adapter
    ), g = [h, ...m, y], v = d.methods ?? e.defaultMethods ?? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], b = v.map((A) => A.toUpperCase());
    o.on(b, f, ...g), i += v.length;
    const x = w.map((A) => A.name);
    l.push({
      path: f,
      methods: b,
      policyNames: x,
      upstreamType: d.pipeline.upstream.type
    });
    for (const A of w)
      c.has(A.name) || c.set(A.name, {
        name: A.name,
        priority: A.priority ?? e.defaultPolicyPriority ?? 100
      });
    s(
      `route ${f} [${b.join(",")}]${x.length ? ` policies=[${x.join(", ")}]` : ""} upstream=${d.pipeline.upstream.type}`
    );
  }
  const u = {
    routes: l,
    policies: Array.from(c.values()).sort(
      (d, f) => d.priority - f.priority
    ),
    gatewayName: r
  };
  if (e.admin) {
    const d = typeof e.admin == "boolean" ? { enabled: !0 } : e.admin;
    d.enabled && (d.auth || console.warn(
      `[stoma:${r}] admin routes enabled without authentication`
    ), es(o, d, u), s(
      `admin routes registered at /${d.prefix ?? "___gateway"}/*`
    ));
  }
  return s(`"${r}" started with ${i} route handlers`), { app: o, routeCount: i, name: r, _registry: u };
}
function ts(e, r) {
  if (!e) return r;
  const t = e.endsWith("/") ? e.slice(0, -1) : e, s = r.startsWith("/") ? r : `/${r}`;
  return `${t}${s}`;
}
function rs(e, r = I, t) {
  const s = e.pipeline.upstream;
  switch (s.type) {
    case "handler":
      return ss(s);
    case "url":
      return as(s, r);
    case "service-binding":
      return ns(s, r, t);
    default:
      throw new p(
        500,
        "config_error",
        `Unknown upstream type: ${s.type}`
      );
  }
}
function ss(e) {
  return async (r) => e.handler(r);
}
var Q = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "proxy-connection",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
];
function ns(e, r = I, t) {
  return async (s) => {
    if (!t?.dispatchBinding)
      throw new p(
        502,
        "config_error",
        `Service binding "${e.service}" requires adapter.dispatchBinding — pass "env" to cloudflareAdapter() or provide a custom dispatchBinding`
      );
    const n = new URL(s.req.url);
    let a = n.pathname;
    if (e.rewritePath) {
      const m = a;
      a = e.rewritePath(a), r(`path rewrite: ${m} -> ${a}`);
    }
    const o = new URL(a + n.search, s.req.url);
    r(
      `service-binding "${e.service}": ${s.req.method} ${o.pathname}${o.search}`
    );
    const i = new Headers(s.req.raw.headers);
    for (const m of Q)
      i.delete(m);
    const l = B(s);
    if (l) {
      const m = re();
      i.set(
        "traceparent",
        Se({
          version: "00",
          traceId: l.traceId,
          parentId: m,
          flags: "01"
        })
      );
    }
    const c = new Request(o.toString(), {
      method: s.req.method,
      headers: i,
      body: s.req.raw.body,
      // @ts-expect-error -- duplex is needed for streaming bodies
      duplex: s.req.raw.body ? "half" : void 0
    }), u = s.get("_otelSpans");
    let d;
    if (u !== void 0) {
      const m = s.get("_otelRootSpan");
      d = new Z(
        `upstream:service-binding:${e.service}`,
        "CLIENT",
        m.traceId,
        ee(),
        m.spanId
      ), d.setAttribute(q.HTTP_METHOD, s.req.method).setAttribute(q.URL_PATH, o.pathname).setAttribute("rpc.service", e.service);
    }
    const f = Date.now(), h = await t.dispatchBinding(
      e.service,
      c
    );
    r(
      `service-binding responded: ${h.status} (${Date.now() - f}ms)`
    ), d && (d.setAttribute(q.HTTP_STATUS_CODE, h.status).setStatus(h.status >= 500 ? "ERROR" : "OK"), u.push(d.end()));
    const w = new Headers(h.headers);
    for (const m of Q)
      w.delete(m);
    return new Response(h.body, {
      status: h.status,
      statusText: h.statusText,
      headers: w
    });
  };
}
function as(e, r = I) {
  const t = new URL(e.target);
  return async (s) => {
    const n = new URL(s.req.url);
    let a = n.pathname;
    if (e.rewritePath) {
      const g = a;
      a = e.rewritePath(a), r(`path rewrite: ${g} -> ${a}`);
    }
    const o = new URL(a + n.search, t);
    if (o.origin !== t.origin)
      throw r(
        `SSRF blocked: rewritten URL origin ${o.origin} != ${t.origin}`
      ), new p(
        502,
        "upstream_error",
        "Rewritten URL must not change the upstream origin"
      );
    r(`proxying ${s.req.method} ${s.req.path} -> ${o.toString()}`);
    const i = new Headers(s.req.raw.headers);
    for (const g of Q)
      i.delete(g);
    if (s.get("_preserveHost") === !0 || i.set("host", o.host), e.headers)
      for (const [g, v] of Object.entries(e.headers))
        i.set(g, v);
    const c = B(s);
    if (c) {
      const g = re();
      i.set(
        "traceparent",
        Se({
          version: "00",
          traceId: c.traceId,
          parentId: g,
          flags: "01"
        })
      );
    }
    const u = new Request(o.toString(), {
      method: s.req.method,
      headers: i,
      body: s.req.raw.body,
      redirect: "manual",
      // Prevent SSRF via redirect to internal services
      // @ts-expect-error -- duplex is needed for streaming bodies
      duplex: s.req.raw.body ? "half" : void 0
    });
    s.set("_proxyRequest", u.clone());
    const d = s.get("_timeoutSignal"), f = s.get("_otelSpans");
    let h;
    if (f !== void 0) {
      const g = s.get("_otelRootSpan");
      h = new Z(
        `upstream:url:${o.host}`,
        "CLIENT",
        g.traceId,
        ee(),
        g.spanId
      ), h.setAttribute(q.HTTP_METHOD, s.req.method).setAttribute(q.URL_PATH, o.pathname).setAttribute(q.SERVER_ADDRESS, o.host);
    }
    const w = Date.now(), m = await fetch(
      u,
      d ? { signal: d } : void 0
    );
    r(
      `upstream responded: ${m.status} (${Date.now() - w}ms)`
    ), h && (h.setAttribute(q.HTTP_STATUS_CODE, m.status).setStatus(m.status >= 500 ? "ERROR" : "OK"), f.push(h.end()));
    const y = new Headers(m.headers);
    for (const g of Q)
      y.delete(g);
    return new Response(m.body, {
      status: m.status,
      statusText: m.statusText,
      headers: y
    });
  };
}
function os(e) {
  let r = e;
  return r.startsWith("/") || (r = `/${r}`), r.length > 1 && r.endsWith("/") && (r = r.slice(0, -1)), r;
}
function is(e, r) {
  const t = r.startsWith("/") ? r : `/${r}`;
  return e.endsWith("/") && t.startsWith("/") ? `${e}${t.slice(1)}` : `${e}${t}`;
}
function on(e) {
  const r = os(e.prefix), t = e.policies ?? [], s = e.metadata ?? {};
  return e.routes.map((n) => {
    const a = is(r, n.path), o = n.pipeline.policies ?? [], i = t.length > 0 || o.length > 0 ? [...t, ...o] : void 0, l = Object.keys(s).length > 0 || n.metadata ? { ...s, ...n.metadata } : void 0;
    return {
      ...n,
      path: a,
      pipeline: {
        ...n.pipeline,
        ...i !== void 0 ? { policies: i } : {}
      },
      ...l !== void 0 ? { metadata: l } : {}
    };
  });
}
function ln(e, r) {
  const t = new TextEncoder(), s = t.encode(e), n = t.encode(r), a = Math.max(s.length, n.length);
  let o = s.length !== n.length ? 1 : 0;
  for (let i = 0; i < a; i++) {
    const l = i < s.length ? s[i] : 0, c = i < n.length ? n[i] : 0;
    o |= l ^ c;
  }
  return o === 0;
}
var ls = "https://stoma.internal", cn = class {
  cache;
  origin;
  /**
   * @param cache - A `Cache` instance (e.g. `caches.default`). Falls back to `caches.default` when omitted.
   * @param origin - Synthetic origin used to construct cache keys. Default: `"https://edge-gateway.internal"`.
   */
  constructor(e, r) {
    this.cache = e ?? caches.default, this.origin = r ?? ls;
  }
  async get(e) {
    const r = new Request(`${this.origin}/${encodeURIComponent(e)}`);
    return await this.cache.match(r) ?? null;
  }
  async put(e, r, t) {
    const s = new Request(`${this.origin}/${encodeURIComponent(e)}`), n = new Headers(r.headers);
    n.set("Cache-Control", `s-maxage=${t}`);
    const a = await r.arrayBuffer(), o = new Response(a, {
      status: r.status,
      headers: n
    });
    await this.cache.put(s, o);
  }
  async delete(e) {
    const r = new Request(`${this.origin}/${encodeURIComponent(e)}`);
    return this.cache.delete(r);
  }
};
function un() {
  return {
    rateLimitStore: new lt(),
    circuitBreakerStore: new wt(),
    cacheStore: new it()
  };
}
const dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Priority: S,
  createPolicyTestHarness: wr,
  definePolicy: T,
  getCollectedDebugHeaders: at,
  isDebugRequested: ot,
  isTraceRequested: ar,
  noopTraceReporter: Ze,
  parseDebugRequest: nt,
  policyDebug: O,
  policyTrace: te,
  resolveConfig: k,
  safeCall: E,
  setDebugHeader: _,
  withSkip: C
}, Symbol.toStringTag, { value: "Module" })), cs = "stoma-playground", L = "rate-limits", us = 1;
function ds() {
  return new Promise((e, r) => {
    const t = indexedDB.open(cs, us);
    t.onupgradeneeded = () => {
      const s = t.result;
      s.objectStoreNames.contains(L) || s.createObjectStore(L);
    }, t.onsuccess = () => e(t.result), t.onerror = () => r(t.error);
  });
}
function hs(e, r) {
  return new Promise((t, s) => {
    const o = e.transaction(L, "readonly").objectStore(L).get(r);
    o.onsuccess = () => t(o.result), o.onerror = () => s(o.error);
  });
}
function Pe(e, r, t) {
  return new Promise((s, n) => {
    const i = e.transaction(L, "readwrite").objectStore(L).put(t, r);
    i.onsuccess = () => s(), i.onerror = () => n(i.error);
  });
}
class hn {
  db = null;
  async increment(r, t) {
    this.db || (this.db = await ds());
    const s = Date.now(), n = await hs(this.db, r);
    if (n && n.resetAt > s) {
      const o = {
        count: n.count + 1,
        resetAt: n.resetAt
      };
      return await Pe(this.db, r, o), o;
    }
    const a = {
      count: 1,
      resetAt: s + t * 1e3
    };
    return await Pe(this.db, r, a), a;
  }
  /** Close the database connection. */
  destroy() {
    this.db && (this.db.close(), this.db = null);
  }
}
export {
  cn as CacheApiCacheStore,
  ms as ConsoleSpanExporter,
  Sr as DEFAULT_IP_HEADERS,
  p as GatewayError,
  hn as IDBRateLimitStore,
  it as InMemoryCacheStore,
  wt as InMemoryCircuitBreakerStore,
  nn as InMemoryMetricsCollector,
  fs as OTLPSpanExporter,
  S as Priority,
  q as SemConv,
  Z as SpanBuilder,
  vs as apiKeyAuth,
  Fs as assignAttributes,
  Js as assignContent,
  Zs as assignMetrics,
  Ts as basicAuth,
  ws as cache,
  sn as circuitBreaker,
  bs as clearJwksCache,
  zs as cors,
  an as createGateway,
  wr as createPolicyTestHarness,
  T as definePolicy,
  qs as dynamicRouting,
  X as extractClientIp,
  xs as generateHttpSignature,
  Rs as generateJwt,
  Cs as geoIpFilter,
  B as getGatewayContext,
  Qs as health,
  Ms as httpCallout,
  Is as interrupt,
  Os as ipFilter,
  ks as jsonThreatProtection,
  Ws as jsonValidation,
  As as jws,
  Es as jwtAuth,
  Ls as latencyInjection,
  un as memoryAdapter,
  en as metricsReporter,
  gs as mock,
  $s as oauth2,
  Vs as overrideMethod,
  O as policyDebug,
  te as policyTrace,
  Ss as proxy,
  ys as rateLimit,
  _s as rbac,
  Ps as regexThreatProtection,
  js as requestLimit,
  tn as requestLog,
  Gs as requestTransform,
  Ys as requestValidation,
  k as resolveConfig,
  Ns as resourceFilter,
  Xs as responseTransform,
  Bs as retry,
  on as scope,
  dn as sdk,
  rn as serverTiming,
  _ as setDebugHeader,
  Ds as sslEnforce,
  Ks as timeout,
  ln as timingSafeEqual,
  Xr as toPrometheusText,
  Us as trafficShadow,
  Hs as verifyHttpSignature,
  C as withSkip
};
