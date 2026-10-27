# NS Delegation Takeover (Full Zone Takeover)

## When To Consider

- a domain's (or subdomain zone's) NS records delegate to a DNS hosting provider/hosted-zone that itself appears deprovisioned, rather than a single CNAME being dangling
- WHOIS/registrar signals or a mismatch between the parent zone's delegation and the child zone's actual hosting suggest an abandoned delegated zone

## Evidence To Collect

- the exact NS records for the (sub)domain, and whether the delegated nameservers themselves resolve and answer authoritatively for the zone
- if the delegated nameservers belong to a cloud DNS provider (e.g. a specific Route 53 hosted zone's assigned nameservers, or an Azure DNS zone's assigned nameservers): whether that specific hosted zone still exists under its original owner, or was deleted while the parent's NS delegation was left pointing at it
- the blast radius if claimed: a claimed zone means the attacker controls **every** record type for that (sub)domain — A, MX, TXT/SPF, CAA — not just one hostname

## False Positive Controls

- delegated nameservers that simply don't respond could indicate a transient outage rather than a deprovisioned zone — confirm via multiple queries over time and multiple resolvers before concluding it's abandoned
- some providers reuse or "park" hosted-zone nameserver pools in ways that don't always mean the exact zone is unclaimed — verify the specific claim mechanism for the provider in question before assuming this works like a generic CNAME takeover

## Safe Validation Boundary

- Confirming the delegation and whether the target hosted-zone/nameserver set is unclaimed is passive and safe.
- Actually claiming an NS-delegated zone is **always** manual-gated, at a stricter bar than any other card in this specialist — full DNS control over a (sub)domain is a categorically larger-impact action than any single-record claim, and must not proceed without explicit, separate approval even if a CNAME-level claim for the same org was already approved.
- If approved: claim minimally, add only the record(s) needed to prove control (e.g. a single benign TXT record), and relinquish the zone immediately after capturing evidence — do not add A/MX/CAA records or otherwise stand up live services during the window you control it.

## Output Requirements

- Explicitly flag this as NS-level (not CNAME-level) in `record_type`, and state the full blast radius (every record type in the zone) in the write-up.
- Require `manual_gate_required: true` unconditionally for any claim step on this class.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [impact-proof-and-reporting](./impact-proof-and-reporting.md)
