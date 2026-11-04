# Source Map Discovery

Find the `.map` files before anything else. Maps are often present even when not obviously linked.

## When To Consider

- You have a target host or one `.js` URL and need to locate its source maps.
- The bundle is minified and you want to know whether original source is recoverable.

## Evidence To Collect

- The `//# sourceMappingURL=<name>` (or `//@ sourceMappingURL=`) trailer at the end of each `.js` — it may be a relative name, absolute URL, or a `data:` inline base64 map.
- A `SourceMap:` / `X-SourceMap:` HTTP response header on the `.js`.
- Naming-convention guesses when no comment exists: `main.js` → `main.js.map`; hashed chunks `app.4f2a.js` → `app.4f2a.js.map`; webpack runtime/vendor chunks; Next.js `/_next/static/chunks/*.js` → same path `+ .map`; Vite `assets/index-<hash>.js` → `+ .map`.
- Whether each candidate is actually reachable (HTTP 200 + JSON body), not just referenced.

## False Positive Controls

- A referenced `.map` that returns 404/403/HTML is not available — do not treat a `sourceMappingURL` comment as proof source exists.
- A `data:` inline map is the map itself (decode the base64), not a separate fetch.
- Third-party/CDN bundles (`cdn.jsdelivr.net`, library chunks) may expose maps that are public library source, not the target's code — note provenance.

## Safe Validation Boundary

- Requesting `.js` and `.js.map` from confirmed-in-scope hosts with GET/HEAD is passive. Guessing map names is passive name-probing (GET for 200/404). Do not expand to out-of-scope hosts; do not high-rate brute-force chunk names.

## Output Requirements

- List each candidate map, its source (comment/header/guessed), and reachable yes/no, into the `sourcemaps` output field.

## Related Techniques

- [overview](./overview.md)
- [sourcemap-structure-and-parsing](./sourcemap-structure-and-parsing.md)
- [false-positives-and-noise](./false-positives-and-noise.md)
