# Subdomain Takeover Overview

## When To Consider

- a host list (from CT logs, DNS aggregators, or a prior recon pass) needs to be triaged for dangling DNS before any per-provider deep-dive
- the task starts from a vague signal ("check for takeovers", "any dangling CNAMEs") with no host list yet

## Evidence To Collect

- for every host: CNAME (and NS/MX/TXT where relevant) chain resolved via a named public resolver, not the local/ISP resolver
- for every non-resolving target: confirmation via a second independent public resolver, and the exact NXDOMAIN/SERVFAIL/timeout behavior observed
- a rough classification pass: no-CNAME (out of scope for this specialist), CNAME-resolves (not dangling), CNAME-target-NXDOMAIN (candidate), apex/NS-level oddity (route separately)

## False Positive Controls

- the local resolver may hijack NXDOMAIN to an ISP parking page — this looks identical to "it resolves" unless checked against a public resolver
- a domain-wide wildcard record or a fully-parked apex domain can make many unrelated-looking hostnames all return 200 — this is not per-host evidence of anything
- "the target doesn't resolve" is not the same as "the target is claimable" — many providers assign non-choosable random suffixes (see `non-claimable-provider-patterns.md`)

## Safe Validation Boundary

- All triage in this card is passive DNS resolution — zero requests to the target org's infrastructure and no resource creation. Proceed to a provider-specific card only once a host is confirmed dangling via a public resolver.

## Output Requirements

- Produce the record-type classification and CNAME chain per host per `output-schema.json`.
- Route each confirmed-dangling host to exactly one provider-specific technique card before making any claimability call.
- Do not label anything `claimable_verified` at this stage — that requires the claim-verification card.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [wildcard-and-parking-false-positives](./wildcard-and-parking-false-positives.md)
