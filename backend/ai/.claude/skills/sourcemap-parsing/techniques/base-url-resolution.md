# Base-URL / Host Placeholder Resolution

This card is the heart of the `METHOD {host/api}/PATH` contract: replacing `{host/api}` with the **actual** host. Most calls use a relative path plus a base URL defined elsewhere, or a build-time placeholder.

## When To Consider

- Extracted URLs are relative (`/api/...`) or contain `${...}` / env placeholders and you must find the concrete host.

## Evidence To Collect

- Literal base definitions in source: `baseURL: "https://api.target.com"`, `const API_BASE = "..."`, `axios.create({ baseURL })`, `fetchBaseQuery({ baseUrl })`, Apollo `uri`, OpenAPI `basePath`, Angular `environment.apiUrl`.
- Build-time env placeholders and their concrete values: `process.env.REACT_APP_*`, `process.env.NEXT_PUBLIC_*`, `import.meta.env.VITE_*`. If the build **inlined** the value, the literal is already in the bundle/source — grep for it. If not, it stays an unresolved placeholder.
- Runtime config: many SPAs fetch a non-hashed `/config.js`, `/env.js`, `/assets/config.json`, or set `window.__ENV__ / window.__CONFIG__` at load — the real host lives there. Fetching that public file (in scope) resolves it.
- Ground truth: the absolute URLs the served app itself calls (its own already-public bundle). The host that appears in those absolute calls is strong evidence for the base of the relative ones.

## False Positive Controls

- Multiple environments in one bundle (`dev`/`staging`/`prod` base URLs selected at runtime) — pick by the selection logic, and if ambiguous, list each candidate rather than guessing one.
- A placeholder you cannot resolve from source or public runtime config must remain `{host/api}` in the output and be listed under `unresolved_placeholders` — never invent a host.
- A base URL pointing at a third-party API (Stripe, Google, Sentry) means those endpoints are not the target's surface — see noise control.

## Safe Validation Boundary

- Grepping source and fetching a **publicly-served** in-scope runtime-config file is passive. Once a host is resolved, its endpoints may be probed for leaks via the **Bounded-Probe Lane** in `safety.md` (one unauthenticated GET/HEAD, concrete path only); anything past that lane is manual-gated.

## Output Requirements

- Populate `base_url_resolution` with each base → resolved host + evidence, and `unresolved_placeholders` for the rest. Apply resolved hosts when rendering `METHOD {host/api}/PATH`.

## Related Techniques

- [endpoint-extraction-patterns](./endpoint-extraction-patterns.md)
- [path-normalization-and-output](./path-normalization-and-output.md)
- [framework-client-conventions](./framework-client-conventions.md)
