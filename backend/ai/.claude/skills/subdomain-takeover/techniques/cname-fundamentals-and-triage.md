# CNAME Fundamentals & Dangling Triage

## When To Consider

- a specific host has a CNAME record and its target's resolution status is unknown or suspicious
- the target needs classification (provider, claimability) before deciding whether to invest further effort

## Evidence To Collect

- the CNAME target hostname, resolved via a named public resolver (e.g. `8.8.8.8`, `1.1.1.1`) — record both, since a single resolver's cache state can be stale or inconsistent
- the authoritative response for the CNAME target's own zone: NXDOMAIN with an SOA-only authority section confirms the zone exists but the specific name doesn't; a timeout or SERVFAIL is a different, less conclusive signal
- whether the *provider's own base domain* (e.g. `elb.amazonaws.com`, `azurewebsites.net`) resolves at all — if it doesn't either, the provider's DNS itself may be having an outage, not evidence of a dangling target
- the original scan's status code/timestamp for this host, if available — a host that was live recently and is now dangling is fresher (and often more actionable) than one that's been dangling for a long time

## False Positive Controls

- confirm through at least two independent public resolvers before concluding NXDOMAIN; a single resolver's answer can reflect local caching or transient issues
- rule out that the *querying environment's* resolver (not a public one) is the one returning bogus results — ISP resolvers commonly hijack NXDOMAIN to a parking/ad page, which looks like "it resolves" until checked elsewhere
- a CNAME chain with more than one hop should be walked to its final target; claimability is a property of the final hop's provider, not necessarily the first one

## Safe Validation Boundary

- DNS resolution against public resolvers generates no requests to the target org's own infrastructure and is always safe to run without additional approval.
- Do not proceed to register/claim anything based on this card alone — hand off to the specific provider card, then to `claim-verification-and-safe-poc.md`.

## Output Requirements

- Report the full CNAME chain, which resolver(s) confirmed each hop, and the exact NXDOMAIN/SERVFAIL/timeout signal observed at the dangling hop.
- Name the suspected provider from the target hostname's shape (or `unknown` if it doesn't match a known pattern) and route accordingly.
- Do not assert claimability here — that belongs to the provider-specific card.

## Related Techniques

- [overview](./overview.md)
- [non-claimable-provider-patterns](./non-claimable-provider-patterns.md)
- [wildcard-and-parking-false-positives](./wildcard-and-parking-false-positives.md)
