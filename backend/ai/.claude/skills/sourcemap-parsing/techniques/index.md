# Source Map Parsing Technique Index

Load via `router.md` guidance — at most six cards per assessment; do not bulk-read.

- [overview](./overview.md) — what source maps are and the end-to-end pipeline to `METHOD {host/api}/PATH`.
- [sourcemap-discovery](./sourcemap-discovery.md) — finding `.map` files (comments, naming conventions, guessing).
- [sourcemap-structure-and-parsing](./sourcemap-structure-and-parsing.md) — the map JSON fields and how to pull `sourcesContent`.
- [reconstruct-source-tree](./reconstruct-source-tree.md) — writing original files back out as a browsable tree.
- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md) — locating HTTP/API calls in reconstructed source.
- [base-url-resolution](./base-url-resolution.md) — turning relative paths / placeholders into the real host.
- [http-method-inference](./http-method-inference.md) — determining the verb per call.
- [path-normalization-and-output](./path-normalization-and-output.md) — dynamic-segment templating, dedup, final output contract.
- [framework-client-conventions](./framework-client-conventions.md) — where endpoints live per framework/client.
- [false-positives-and-noise](./false-positives-and-noise.md) — dropping third-party/library/dead-code URLs.
- [secrets-and-sensitive-data-handling](./secrets-and-sensitive-data-handling.md) — flagging, never using, embedded secrets.
