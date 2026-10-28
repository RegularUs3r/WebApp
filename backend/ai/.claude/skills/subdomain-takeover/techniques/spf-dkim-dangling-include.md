# Dangling SPF/DKIM Include (Spoofing Risk)

## When To Consider

- a domain's SPF TXT record contains an `include:` mechanism referencing a third-party sending service, and that service's hostname/domain is itself dangling
- a DKIM selector record is a CNAME to a third-party ESP hostname that is itself dangling

## Evidence To Collect

- the exact SPF record and the specific `include:` target that's dangling, and whether it's reachable via a public resolver
- whether the DKIM selector CNAME target resolves, since a dangling DKIM CNAME breaks signature verification for mail claiming to use that selector rather than enabling spoofing directly — the two records have different exploitation stories and should not be conflated
- whether claiming the dangling SPF-included domain would let an attacker send mail that passes SPF alignment for the target's domain, which is the actual spoofing primitive here

## False Positive Controls

- SPF `include:` failures (a target that's merely unreachable, not dangling in a claimable sense) commonly just cause a `permerror`/neutral SPF result rather than a security issue — verify the include target is genuinely claimable, not just currently down
- a dangling DKIM selector alone (without SPF issues) generally *breaks* mail authentication for that selector rather than *enabling* spoofing — don't overstate impact without checking whether DMARC alignment/enforcement would still block spoofed mail via other mechanisms

## Safe Validation Boundary

- Reading SPF/DKIM DNS records and checking the include target's resolution status is passive and safe.
- Claiming the dangling included domain to send test mail that passes SPF is manual-gated per `safety.md` — sending any mail that could plausibly land in a real recipient's inbox as "from" the target domain requires explicit approval and a tightly scoped, clearly-labeled test.

## Output Requirements

- Name the exact SPF/DKIM mechanism affected and whether DMARC policy/enforcement on the domain would still mitigate spoofing even if the include is claimed (check the domain's DMARC record `p=` value).
- Require `manual_gate_required: true` for any actual test mail sent.

## Related Techniques

- [mx-record-takeover](./mx-record-takeover.md)
- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
