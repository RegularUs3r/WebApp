# HTTP/API Call Extraction Patterns

Scan reconstructed source for where the app talks to its backend. Use `client-signatures.json` as the pattern catalog.

## When To Consider

- Source is reconstructed (or you are scanning the minified bundle as a fallback) and you need the raw call sites.

## Evidence To Collect

- Direct client calls: `axios.get(url)`, `axios.post(url, body)`, instance `.request({url, method})`, `fetch(url, {method})`, Angular `this.http.get(url)`, AngularJS `$http`, `XMLHttpRequest.open(method, url)`, jQuery `$.ajax`.
- Indirect/declarative calls: RTK Query `builder.query/mutation`, TanStack `queryFn/mutationFn`, tRPC `.query/.mutate`, OpenAPI-generated SDK methods, Apollo/GraphQL clients.
- Route/path string literals even without a visible verb: `'/api/...'`, `'/v1/...'`, `/rest/`, `/graphql`, template literals `` `/users/${id}` ``.
- The variable or constant each URL is built from (feeds base-URL resolution).

## False Positive Controls

- A `.get(`/`.post(` is not always HTTP — `Map.get`, `URLSearchParams.get`, `localStorage.getItem`, router `.get` all collide. Require the argument to look like a path/URL (starts with `/`, or `http`, or contains `/`).
- Commented-out or dead-code calls and `*.test/*.spec/*.stories` files describe non-production or example endpoints — tag, don't assert.
- String concatenation splits a URL across literals (`base + "/users/" + id`) — the regex catches a fragment; reassemble from context before finalizing.

## Safe Validation Boundary

- Pure static scanning. It sends nothing. The helper `scripts/extract-endpoints.mjs` runs this heuristically; treat its output as leads to verify against source, not as confirmed truth. Probing an extracted endpoint for leaks is bounded to the **Bounded-Probe Lane** in `safety.md` (one unauthenticated GET/HEAD, in-scope, concrete path); anything beyond it is manual-gated.

## Output Requirements

- Collect `{raw_url, method_hint, client, source_file}` tuples to hand to method inference, base-URL resolution, and normalization.

## Related Techniques

- [http-method-inference](./http-method-inference.md)
- [base-url-resolution](./base-url-resolution.md)
- [framework-client-conventions](./framework-client-conventions.md)
