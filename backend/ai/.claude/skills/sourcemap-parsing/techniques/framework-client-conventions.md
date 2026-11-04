# Framework & HTTP-Client Conventions

Where endpoints live, and how method/base-URL are expressed, differs by stack. Identify the stack first, then look in the right place.

## When To Consider

- You know (or can tell from the bundle) the frontend framework / HTTP client and want to target extraction precisely.

## Evidence To Collect

- **axios**: central `axios.create({ baseURL })` instance in an `api`/`http` module; calls are `instance.get/post(...)`. Base URL is the single `baseURL`.
- **fetch (hand-rolled)**: a wrapper like `request(path, opts)` prefixing a base constant; method in `opts.method`.
- **Angular `HttpClient`**: services inject `HttpClient`; `this.http.get<T>(`${env.apiUrl}/...`)`; base is `environment.apiUrl`.
- **RTK Query**: `createApi({ baseQuery: fetchBaseQuery({ baseUrl }), endpoints })`; each `builder.query/mutation` has a `query` returning a path (+ method for mutations).
- **TanStack Query / SWR**: hooks wrap a real client inside `queryFn/mutationFn` — inspect that function, not the hook.
- **tRPC**: no REST paths; routers + `httpBatchLink({ url })`; `.query`⇒GET, `.mutate`⇒POST over the batch URL.
- **OpenAPI/Swagger-generated SDK**: `Configuration({ basePath })` + generated `*Api` classes; verbs embedded in generated request builders — this often yields the **complete** documented API.
- **GraphQL (Apollo/urql/graphql-request)**: single POST endpoint (`uri`); operations are not REST paths.
- **gRPC-web**: generated service clients POST to `/<package>.<Service>/<Method>`.
- **Next.js**: app code calls both external APIs and same-origin `/api/*` route handlers — the latter are first-party endpoints at the app's own origin.

## False Positive Controls

- Don't flatten a GraphQL/tRPC transport into dozens of REST paths — represent it as its single endpoint plus the operation list.
- A generated SDK may include endpoints the app never calls (full spec) — valid surface, but mark as "declared, call site not observed" when relevant.
- Vendor SDKs (Stripe, Firebase, analytics) bundled in ship their own base URLs — not the target's API.

## Safe Validation Boundary

- Identifying conventions is static reading. No requests are sent during extraction.

## Output Requirements

- Note the detected stack and where endpoints were sourced from (instance module / generated SDK / route handlers), and let it steer `endpoints` + `base_url_resolution`.

## Related Techniques

- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
- [http-method-inference](./http-method-inference.md)
- [base-url-resolution](./base-url-resolution.md)
