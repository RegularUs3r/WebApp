# HTTP Method Inference

Every output line needs a verb. Infer it from the call site, and mark how confident you are.

## When To Consider

- You have call sites but the method is implicit, abstracted, or generated.

## Evidence To Collect

- Explicit verb in the call: `axios.get/post/put/delete/patch`, `this.http.get(...)`, `$.post`, `.open('POST', ...)`.
- `options.method` for `fetch(url, { method: 'PUT' })`; default to `GET` when `fetch` has no method.
- Declarative descriptors: RTK Query `builder.query` ⇒ GET, `builder.mutation` ⇒ the `method` in its returned object (often POST/PUT/DELETE); tRPC `.query` ⇒ GET, `.mutate` ⇒ POST.
- Generated SDKs: open the generated request-builder body for the embedded verb; the public method name (e.g. `getUserById`, `createOrder`) is a hint, not proof.
- GraphQL and gRPC-web: method is **POST** to a single transport endpoint; the operation/method name is not a REST path.

## False Positive Controls

- Verb-shaped method names lie: a wrapper named `getOrders()` may issue a POST search internally — check the underlying call, not the function name.
- A single `.request(config)` with a dynamic `method` variable cannot be pinned statically — emit `ANY` and flag it rather than guessing.
- `OPTIONS`/`HEAD` preflight or probing helpers are not the business method — ignore framework plumbing.

## Safe Validation Boundary

- Inference is static. The only way to *confirm* a method is to send the request (including an `OPTIONS`/`Allow` probe), which is manual-gated — do not do it as part of extraction.

## Output Requirements

- Attach the inferred method and its basis (explicit / options / descriptor / generated / protocol-default) and a confidence to each endpoint; use `ANY` where genuinely undeterminable.

## Related Techniques

- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
- [framework-client-conventions](./framework-client-conventions.md)
- [path-normalization-and-output](./path-normalization-and-output.md)
