# Source Map Structure & Parsing

A v3 source map is JSON. You rarely need to decode the `mappings` VLQ for endpoint work — the prize is `sourcesContent`.

## When To Consider

- You have a reachable `.map` and need to pull the original source out of it.
- You need to judge whether a map is reconstructable at all.

## Evidence To Collect

- `version` (expect `3`).
- `sources` — array of original file paths (often `webpack://<project>/src/...`, `../src/...`, or `vite://`).
- `sourcesContent` — array parallel to `sources` holding the **original file text**. This is the reconstructable gold; if it is `null`/absent/empty, the map alone cannot rebuild source.
- `names`, `mappings` — identifier list and VLQ position mapping; needed only if you must map minified positions back to source (not usually required for endpoint extraction).
- `sourceRoot` — optional prefix prepended to each `sources` entry.

## False Positive Controls

- `sources` present but `sourcesContent` absent ⇒ **not** reconstructable from the map; set status `sources_content_absent` and fall back to scanning the minified bundle.
- Some entries in `sourcesContent` are `null` even when others are populated — handle per-index, don't assume the whole array is present.
- `webpack://` and `vite://` are virtual scheme prefixes, not real hosts — strip them when deriving a path; they are not API hosts.

## Safe Validation Boundary

- Parsing is fully local and passive. Store shapes/hashes and the extracted first-party source needed for the task; do not dump or exfiltrate whole third-party source bodies.

## Output Requirements

- Record, per map, whether `sourcesContent` was present and how many first-party sources it yielded, into `sourcemaps` / `reconstructed_sources`.

## Related Techniques

- [sourcemap-discovery](./sourcemap-discovery.md)
- [reconstruct-source-tree](./reconstruct-source-tree.md)
- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
