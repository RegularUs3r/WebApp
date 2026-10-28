# Subdomain Takeover Analysis Specialist

A lightweight SSkills specialist for triaging dangling DNS records (CNAME, NS, MX, SPF/DKIM includes, expired registrations) and determining whether they are practically claimable, not just dangling.

This is not a claim-and-exploit pack. It does not automatically register cloud resources, deploy content, or leave a claimed asset live against a real org's domain. Its default output is a classification (claimable / non-claimable / false-positive / needs-verification) plus the least-invasive way to prove it.

## How To Use

1. Start with [router.md](router.md).
2. Apply [safety.md](safety.md).
3. Check [provider-fingerprints.json](provider-fingerprints.json) for a fast claimable/non-claimable lookup by CNAME target pattern.
4. Load at most five relevant files from [techniques](techniques/index.md).
5. Return structured output using [output-schema.json](output-schema.json).

## Why This Shape

Most "dangling CNAME" lists are noisy: many targets look abandoned but are provider-assigned and non-claimable (AWS ELB/ALB/NLB, Azure Traffic Manager), and many "hits" are actually a wildcard DNS record or a fully-parked domain rather than a real per-host takeover. This specialist routes by DNS record type and provider fingerprint rather than by a single generic "is it dangling" check, so effort goes into the subset that's actually exploitable, and it explicitly gates the step that turns a finding into an active claim — because unlike most web vulnerability classes, proving a takeover means registering a real resource that could receive real users' traffic, cookies, and OAuth callbacks.

## Included Technique Cards

See [techniques/index.md](techniques/index.md).

## Provider Fingerprints

See [provider-fingerprints.json](provider-fingerprints.json) for a curated, non-exhaustive table of CNAME/NS target patterns mapped to claimable/non-claimable/conditional status. Treat `can-i-take-over-xyz` (in [sources.json](sources.json)) as the canonical, continuously-updated source; this file is a compact offline summary of the patterns most relevant to the technique cards here.

## Sources

See [sources.json](sources.json). Built primarily from EdOverflow's `can-i-take-over-xyz` reference, OWASP's Web Security Testing Guide, Frans Rosén / Detectify's foundational subdomain-takeover research, and the relevant cloud/SaaS vendors' own custom-domain documentation.

## License

MIT, consistent with the SSkills specialist-skill format this card follows.
