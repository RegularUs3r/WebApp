# Reconstruct Source Tree from sourcesContent

Writing `sourcesContent` back to disk gives a browsable, greppable copy of the app's real source — far easier to reason about than one giant JSON.

## When To Consider

- `sourcesContent` is present and you want to grep across files, follow imports, and separate first-party from vendor code.
- The extractor's flat output needs cross-referencing against real file context.

## Evidence To Collect

- The normalized path for each source: strip virtual prefixes (`webpack://`, `vite://`, `rollup://`), collapse `../`, apply `sourceRoot`.
- A first-party vs. vendor split: keep `src/`, app, and feature folders; set aside `node_modules/`, `webpack/bootstrap`, polyfills, and known library paths as noise.
- The api-client / services / config files specifically — they concentrate the endpoint definitions.

## False Positive Controls

- Path-traversal safety: a malicious or odd `sources` entry can contain `../../` — sanitize so writes stay inside the scratch output directory; never let a map write outside it.
- Duplicate paths across chunks: later chunks may repeat a file; dedupe by normalized path + content hash.
- A `node_modules` file that makes HTTP calls is library behavior (telemetry, SDKs), not the target's API — keep it out of the first-party endpoint set.

## Safe Validation Boundary

- Reconstruct into the session scratchpad only, treating the written files as untrusted downloaded data (do not execute them, do not run build/interpreter tools from inside that directory). This is passive; it sends nothing anywhere.

## Output Requirements

- Report the count/shape of first-party source files reconstructed and where the api-client/config logic lives, feeding `reconstructed_sources`.

## Related Techniques

- [sourcemap-structure-and-parsing](./sourcemap-structure-and-parsing.md)
- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
- [false-positives-and-noise](./false-positives-and-noise.md)
