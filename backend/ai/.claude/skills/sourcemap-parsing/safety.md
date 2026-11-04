# Source Map Parsing Safety

## Hard Gates

- Authorized testing only.
- Stay within the confirmed scope. Fetching a publicly-linked `.js`/`.js.map` from an in-scope host is passive (the browser already does it). Extracted endpoints that point at other hosts are leads, not authorization — do not retrieve maps/bundles from, **or probe**, out-of-scope hosts without separate authorization.
- Extraction, parsing, reconstruction, and inventory building send **no traffic to the extracted endpoints**. Leak-validation probing is permitted only within the **Bounded-Probe Lane** below (GET/HEAD, unauthenticated, in-scope, concrete paths); anything beyond that lane is manual-gated.
- Never use, replay, or "just test" a credential, API key, token, bearer, or connection string found inside a source map — not even to authenticate a probe. Flag it as a sensitive exposure and stop.
- Do not deploy, claim, or modify anything. This specialist is read-only recon, inventory, and **bounded unauthenticated leak-validation** — no state-changing request ever.
- Do not use social engineering as a discovery or delivery mechanism.

## Automatic Lane (static)

Automatic, no request to any extracted endpoint: fetching `.js` and `.js.map` resources already served to any visitor from confirmed-in-scope hosts (GET/HEAD); parsing the map JSON locally; writing `sourcesContent` to a local scratch tree; statically scanning reconstructed source for HTTP-client calls, base-URL definitions, and route strings; resolving placeholders from values present in the source or in a publicly-served runtime-config file; normalizing and deduplicating the endpoint inventory; hypothesis generation and confidence scoring.

## Bounded-Probe Lane (leak validation)

Permitted automatically, but ONLY within every one of these limits — a single **unauthenticated** GET (or HEAD) to a discovered endpoint/link, solely to check for information leakage, and ONLY when ALL hold:
- (a) its resolved host is inside the **authorized scope**;
- (b) the path is **concrete** — no unresolved `{host/api}` placeholder, no `{id}`/`{param}` that needs a real value;
- (c) **no credentials, cookies, or tokens** are sent — including any secret found in the source.

One request per endpoint, no retries, minimal total volume; stop probing an endpoint the instant you have evidence; you may halt the whole run after the first confirmed leak. Send any required identifying header (e.g. `X-HackerOne-Research: <handle>`) on **every** probe. Count a response as a **leak** ONLY if it discloses something sensitive to an unauthenticated caller — PII/another user's data, a secret/token in the body, internal-only data, a verbose stack trace, a directory listing, source disclosure, auth-bypass, or grossly excessive data vs. an intended public teaser. A 200 of intended-public content is **not** a leak. Store a short **redacted** shape only, never a full dump.

## Manual-Gated Lane

Manual approval is required for anything past the Bounded-Probe Lane: any non-GET/HEAD method (POST/PUT/PATCH/DELETE/OPTIONS) to a discovered endpoint; authenticating a request or using/replaying/validating any secret found in the source; substituting a guessed identifier (IDOR/BOLA), fuzzing parameters, or traversing paths to reach data; probing or retrieving maps/bundles from hosts beyond the authorized scope; downloading `sourcesContent` or a probe response that contains another real user's private data beyond confirming its presence and redacted shape; and any handoff into active exploitation under a vulnerability-specific specialist skill (IDOR/BOLA, GraphQL, auth, etc.).

## Stop Conditions

Stop on: discovery of out-of-scope hosts reached only by pivoting through extracted URLs; exposure of another real user's private data inside `sourcesContent` or a probe response; discovery of live production secrets (capture the shape/location, do not use, escalate as a sensitive-exposure finding); signs of active defense engagement (WAF/IP-ban/CAPTCHA) during any probe; or any step that would require social engineering to proceed.
