# Non-Claimable Provider Patterns (ELB/ALB/NLB/Traffic Manager)

## When To Consider

- a dangling CNAME target matches `*.elb.amazonaws.com`, `*.trafficmanager.net`, or a similar managed load-balancer/traffic-routing hostname
- before spending further effort assuming any dangling CNAME is automatically a working takeover

## Evidence To Collect

- confirm the target hostname's suffix format includes a provider-assigned, non-choosable component (e.g. AWS ELB/ALB/NLB hostnames embed a random ~10-digit numeric ID assigned by AWS at creation time, not requestable by name)
- confirm via the provider's own DNS zone that the specific hostname is genuinely gone (SOA-only NXDOMAIN response from the provider's authoritative zone, e.g. `us-east-1.elb.amazonaws.com`), which rules out a resolver/caching artifact

## False Positive Controls

- this is the inverse false-positive: don't discard the finding entirely — it's real evidence of a stale/unpruned DNS record and infra hygiene gap, just not a working "serve my own content" takeover
- don't assume every managed-service hostname is non-claimable — verify the specific provider's naming convention; some (Azure App Service, most PaaS platforms) *are* customer-chosen despite superficially looking similar to ELB-style names

## Safe Validation Boundary

- All of this is passive DNS/zone inspection — no resource creation, no claim attempt, nothing manual-gated at this stage.
- Do not attempt to force a claim against a provider-assigned name (e.g. repeatedly creating/deleting load balancers hoping to land on the same ID) — this wastes effort and is not how these namespaces work.

## Output Requirements

- Classify explicitly as `non_claimable_provider` in the output schema, with the specific evidence (naming convention + authoritative NXDOMAIN).
- Recommend reporting it as a stale-DNS/infrastructure-hygiene finding rather than a subdomain takeover — most programs triage this as Low/Informational unless their policy explicitly rewards hygiene findings.
- Note the information disclosure angle if relevant (internal naming conventions, environment tiers, revealed via the dangling hostname itself) as the residual value of the finding.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [impact-proof-and-reporting](./impact-proof-and-reporting.md)
