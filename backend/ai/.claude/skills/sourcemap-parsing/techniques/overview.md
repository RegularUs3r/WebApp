# Source Map Parsing Overview

A source map (`.js.map`) is a JSON file that maps a minified/bundled `.js` back to its original sources. When the build ships `sourcesContent`, the map contains the **entire original, unminified source** — component code, API clients, route tables, config — which is exactly where the application's server-side API surface is described. The job of this specialist is to convert that into a clean, deduplicated endpoint inventory.

## When To Consider

- A target serves `.js` bundles and you want its real API surface without blindly fuzzing.
- A `//# sourceMappingURL=` comment, or a reachable `.js.map`, is present.
- You have a downloaded `.map` file and need `METHOD {host/api}/PATH` out of it.

## Evidence To Collect

- The set of reachable `.map` files and their generator (webpack/vite/rollup/esbuild/next/tsc).
- Whether `sourcesContent` is present (reconstructable) or only `sources` paths (not reconstructable from the map alone).
- The HTTP-client library in use (drives extraction and method inference).

## False Positive Controls

- A `sourceMappingURL` that 404s yields nothing — confirm reachability.
- A map without `sourcesContent` cannot reconstruct source; don't claim endpoints you can't see.
- Public open-source frontends intentionally ship maps — note this; the *source* exposure may not itself be a finding even though the endpoint inventory is still useful.

## Safe Validation Boundary

- Fetching publicly-served `.js`/`.map` and parsing them locally is passive; extraction sends **no** request to any endpoint it finds. Leak-validation then probes the in-scope endpoints via the **Bounded-Probe Lane** in `safety.md` (one unauthenticated GET/HEAD, concrete path only); anything beyond that lane is manual-gated.

## Output Requirements

- State which maps were parsed, whether source was reconstructable, and produce the `METHOD {host/api}/PATH` inventory with per-entry confidence, per `output-schema.json`.

## Related Techniques

- [sourcemap-discovery](./sourcemap-discovery.md)
- [sourcemap-structure-and-parsing](./sourcemap-structure-and-parsing.md)
- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
