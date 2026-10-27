# Wildcard DNS & Domain-Parking False Positives

## When To Consider

- a batch of permutation/brute-forced hostnames on the same base domain all return identical (or near-identical) live content with 200 status
- any single host's status looks live but the finding feels too easy, or too broad, relative to how the host list was generated

## Evidence To Collect

- resolve a deliberately made-up, never-real sibling hostname on the same base domain (e.g. `totally-made-up-xyz123.<base-domain>`) via a public resolver — if it resolves identically to the "real" discovered hosts, the domain has a wildcard record and none of the individual hostnames are distinct findings
- check the base domain's own NS records — if they point to a generic/shared-hosting or domain-parking registrar's nameservers (rather than the org's expected DNS provider), the entire domain may have expired and been re-registered by a parking service, which explains uniform "200 OK" across every subdomain permutation
- fetch the actual page content/response headers from the base domain (ignoring TLS SNI errors if needed, e.g. `curl -k`) — ad-monetization/parking scripts (recognizable vendor names in the JS, e.g. a parking-network domain referenced in a CSP/permissions-policy header or inline script) confirm parking rather than a real wildcard vhost

## False Positive Controls

- a wildcard vhost (intentional, org-operated) and a fully-parked expired domain look similar (both make every hostname "resolve") but have very different implications — a wildcard vhost is a config choice on infrastructure the org still owns; a parked/expired domain means the org lost the domain entirely, which is a different (and likely out-of-scope-for-normal-takeover-reporting) finding
- if the domain is genuinely parked/expired, individual "subdomain takeover" framing doesn't apply — the finding, if any, is that a *sibling, still-live* asset trusts the expired domain somewhere (CORS allow-list, OAuth `redirect_uri` allow-list, SPF/DKIM include) — check for that before writing anything up

## Safe Validation Boundary

- All of this is passive: a DNS query for a made-up hostname and a normal GET request generate no more load or risk than checking any other page.

## Output Requirements

- Classify explicitly as `false_positive_wildcard_or_parking` when confirmed, and state which check (made-up-sibling resolution, NS records, or page content) proved it.
- If parking/expiry is confirmed, redirect the write-up toward checking sibling-asset trust rather than treating the individual permutation hostnames as separate findings.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [overview](./overview.md)
