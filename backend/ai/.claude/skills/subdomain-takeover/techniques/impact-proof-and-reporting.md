# Impact Proof & Reporting Contract

## When To Consider

- a dangling record has been classified (claimable, non-claimable, or false-positive) and it's time to decide what to submit and how
- deciding how much evidence is enough without an unnecessary live claim

## Evidence To Collect

- for claimable-and-verified findings: the CNAME/NS/MX chain, the provider's name-availability confirmation (or completed-claim evidence if approved), and — if a real DevOps trust dependency exists — what depends on the domain (linked app, cookie scope, OAuth redirect allow-list)
- for non-claimable findings (ELB/ALB/NLB, Traffic Manager, similar): the naming-convention evidence and authoritative NXDOMAIN proof; frame explicitly as a stale-DNS/hygiene finding, not a takeover
- for wildcard/parking false positives that turned out to reveal a *sibling-asset trust* issue: the specific trust reference (CORS entry, OAuth `redirect_uri`, SPF include) found on the still-live sibling asset

## False Positive Controls

- don't submit a report claiming "subdomain takeover" for a provider-assigned, non-claimable hostname — mislabeling a hygiene finding as a takeover damages report credibility with triagers who know the provider's naming conventions
- don't submit a live "working exploit" claim without capturing evidence promptly — if the resource is released before evidence is captured, or claimed and left live indefinitely, both under- and over-deliver on what a triager needs

## Safe Validation Boundary

- Most triagers accept a no-resource-created name-availability confirmation plus DNS evidence as sufficient proof of a claimable finding — a full live deployment is not always necessary and increases risk (real visitor traffic, cookies, OAuth callbacks) for marginal additional proof value.
- If a live claim was completed per manual approval, the write-up must include the exact release/cleanup timestamp.

## Output Requirements

- Match severity framing to claimability: claimable-and-verified (Medium–Critical depending on what the domain is trusted for, e.g. cookie scope or OAuth), non-claimable/stale-DNS (Low/Informational), false-positive (no report).
- Include the responsible-disclosure timeline: discovery time, verification method, claim window (if any) and release time.
- Never include real visitor data captured during a claim window in the report body.

## Related Techniques

- [claim-verification-and-safe-poc](./claim-verification-and-safe-poc.md)
- [non-claimable-provider-patterns](./non-claimable-provider-patterns.md)
- [wildcard-and-parking-false-positives](./wildcard-and-parking-false-positives.md)
