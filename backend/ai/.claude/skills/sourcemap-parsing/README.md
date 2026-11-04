# Source Map Parsing & API Endpoint Extraction Specialist

A lightweight-specialist skill (`sskills/lightweight-specialist/v1`) that turns exposed JavaScript source maps (`.js.map`) into a normalized API surface.

**Deliverable:** a deduplicated endpoint inventory where every line reads

```
METHOD {host/api}/PATH
```

with `{host/api}` replaced by the actual resolved host/base once known — e.g. `POST https://api.example.com/v2/orders/{id}/cancel`.

## Pipeline

1. **Discover** maps — `//# sourceMappingURL=`, `.js` → `.js.map` guessing, build-tool conventions.
2. **Parse** the map JSON — pull `sourcesContent` (the original, unminified source).
3. **Reconstruct** the first-party source tree (drop vendor/node_modules noise).
4. **Extract** HTTP/API calls (axios, fetch, Angular `HttpClient`, XHR, generated SDKs, GraphQL).
5. **Resolve** base-URL placeholders to the real host (literal, `baseURL`, runtime `config.js`, inlined env, or the app's own absolute calls).
6. **Normalize** dynamic segments (`${id}` → `{id}`), dedup, and emit `METHOD {host/api}/PATH`.

## Layout

- `skill.json` — manifest: id, signal classes, safety posture, automation policy, technique cards.
- `router.md` — read first; triages the signal to ≤6 technique cards.
- `safety.md` — hard gates, automatic vs. manual-gated lanes, stop conditions.
- `output-schema.json` — required structured-output shape (endpoint line format included).
- `client-signatures.json` — HTTP-client call-pattern signatures feeding extraction/method inference.
- `sources.json` — attribution references (specs, build tools, HTTP clients, tooling).
- `techniques/*.md` — narrow per-technique cards, loaded selectively per router guidance.
- `scripts/extract-endpoints.mjs` — heuristic extractor: `.map`/URL/dir → `METHOD {host/api}/PATH` lines.
- `scripts/validate.js` — self-check that the skill's structure/headings/links are intact.

## Usage (heuristic extractor)

```
node scripts/extract-endpoints.mjs app.js.map
node scripts/extract-endpoints.mjs https://target/static/js/main.abc123.js.map --base https://api.target.com
node scripts/extract-endpoints.mjs ./maps/ --host VITE_API_URL=https://api.target.com --json
```

The script is a first pass, not an oracle — always reconcile its output against the reconstructed source, and respect `safety.md`: the extractor sends **no** request to any endpoint. Leak-validation then probes in-scope endpoints via the Bounded-Probe Lane (one unauthenticated GET/HEAD, concrete path only); anything beyond that lane is manual-gated.

## Retrieval discipline

Load `router.md` + `safety.md` + `output-schema.json` first, then only the technique cards the router points to (max 6). Do not bulk-read `techniques/*.md`.
