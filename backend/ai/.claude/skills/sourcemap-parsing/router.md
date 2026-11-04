# Source Map Parsing Router

Start here after a signal has been routed to the source-map specialist ("parse this js.map", "extract the endpoints from this bundle", "any source maps exposed", "turn this app's JS into an API list"). The incoming context may be only a target host, a single `.js` URL, a `//# sourceMappingURL=` reference, or a downloaded `.map` file. Do not assume source is reconstructable or that any extracted string is a real, in-scope endpoint until confirmed.

## Goal

Produce a deduplicated endpoint inventory where every line reads:

```
METHOD {host/api}/PATH
```

`{host/api}` is a placeholder you must replace with the **actual** resolved host/base path once known (e.g. `GET https://api.example.com/v2/users/{id}`). Leave the literal `{host/api}` only when the base URL genuinely cannot be resolved from the source or runtime config — and say so explicitly in the output.

## First Pass

1. Confirm scope: the exact host(s) authorized. A `.map` file is served to any browser's devtools, so fetching a publicly-linked one is passive — but endpoints you extract may point at other hosts; those are leads, not authorization to probe.
2. Discover candidate maps (`sourcemap-discovery`): `//# sourceMappingURL=` comments, `.js` → `.js.map` guesses, and build-tool naming conventions.
3. Confirm each `.map` is actually reachable and contains `sourcesContent` (not just `sources` paths) — only then is source reconstructable.
4. Parse and (optionally) reconstruct the tree (`sourcemap-structure-and-parsing`, `reconstruct-source-tree`).
5. Extract HTTP calls, infer method, resolve base URL, normalize paths, emit the `METHOD {host/api}/PATH` inventory. The helper `scripts/extract-endpoints.mjs` performs a heuristic first pass; always sanity-check its output against the reconstructed source.
6. Load at most six technique cards from `techniques/` per the hints below. Produce output matching `output-schema.json`.

## Routing Hints

- Need the baseline method, or nothing known yet: load `overview.md` and `sourcemap-discovery.md`.
- Have a `.js` URL but no confirmed `.map`: load `sourcemap-discovery.md`.
- Have a `.map` file and need to understand/parse its JSON (`version`, `sources`, `sourcesContent`, `mappings`): load `sourcemap-structure-and-parsing.md`.
- Want original files written back out as a browsable tree: load `reconstruct-source-tree.md`.
- Source is reconstructed and you need to find the API calls: load `endpoint-extraction-patterns.md`.
- Endpoints come out as relative paths (`/api/...`) or contain `${...}` / env placeholders and you must find the real host: load `base-url-resolution.md`.
- Method per call is unclear (bare `.request(...)`, generated SDK, GraphQL): load `http-method-inference.md`.
- Ready to normalize dynamic segments and emit the final inventory: load `path-normalization-and-output.md`.
- The app uses a specific framework/client (Angular `HttpClient`, axios instance, `fetch`, RTK Query, TanStack Query, tRPC, OpenAPI-generated SDK, gRPC-web): load `framework-client-conventions.md`.
- Output is polluted with analytics/CDN/library URLs or example endpoints: load `false-positives-and-noise.md`.
- A source file contains something credential-shaped (key, token, bearer, connection string): load `secrets-and-sensitive-data-handling.md`.
- The signal started from broad bundle collection rather than one known map: hand list-building to the `web-fingerprinting` skill's `js-aware-crawling` / `subdomain-enumeration` cards, then bring the JS/map list back here.

## Decision Rules

- A `sourceMappingURL` comment pointing at a `.map` that 404s is **not** an exposure and yields no source — confirm reachability first.
- A `.map` with `sources` paths but **no `sourcesContent`** is not reconstructable from the map alone; downgrade expectations and rely on the minified bundle plus `names`/`mappings` only.
- An extracted string literal is a **candidate** endpoint, not a confirmed one: `/api/foo` in dead code, a commented-out call, or a third-party library path is not the target's live API. Apply `false-positives-and-noise` before asserting.
- A relative path with an **unresolved** base URL stays `METHOD {host/api}/PATH` in the output — never guess a host you cannot evidence from source, runtime config, or the served app's own absolute calls.
- Method inference is best-effort: mark it as inferred (and how) rather than asserting; where truly unknown, emit `ANY` and flag it.
- Extraction itself sends nothing to the endpoints. Checking a discovered endpoint for information leakage is permitted via the **Bounded-Probe Lane** in `safety.md` (a single unauthenticated GET/HEAD, in-scope, concrete path only); anything past that lane (other methods, auth, found secrets, ID enumeration/fuzzing, out-of-scope) is manual-gated.
- Any credential-shaped string is flagged as a sensitive exposure and **never used** — hand it off per `safety.md`.
- Never use social engineering as a discovery mechanism.
