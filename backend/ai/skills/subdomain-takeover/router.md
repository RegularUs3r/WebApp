# Subdomain Takeover Router

Start here after another system or the user has routed a signal to the subdomain-takeover specialist ("check for dangling CNAMEs", "any of these takeover-able", "dns takeover", "is this subdomain claimable"). The incoming context may only be a list of hosts with status codes; do not assume any of them are genuinely dangling or claimable yet.

## First Pass

1. Confirm scope: the exact domain(s)/org the user is authorized to test, and whether the host list came from a passive source (CT logs, DNS aggregators) or an active scan.
2. Resolve each host's CNAME chain (and NS/MX/TXT where relevant) against a public resolver (e.g. `8.8.8.8`/`1.1.1.1`), not the local/ISP resolver — ISP resolvers frequently hijack NXDOMAIN to a parking page and will produce false "it resolves" signals.
3. Separate hosts into: no CNAME (direct A/AAAA, not in scope for this specialist), CNAME resolves fine (not dangling), CNAME target is NXDOMAIN or SERVFAIL (candidate — proceed), and apex/whole-domain oddities (NS records changed, WHOIS suggests expiry — route to a different card).
4. If the local resolver's behavior is inconsistent with a public resolver on any host, flag it and re-verify everything through the public resolver before drawing conclusions.
5. Load at most five technique cards from `techniques/` based on the routing hints below.
6. Produce output matching `output-schema.json`.

## Routing Hints

- Nothing known yet, or need the baseline detection method: load `overview.md` and `cname-fundamentals-and-triage.md`.
- CNAME target matches (or looks like) an S3/Azure Blob/GCS-style bucket hostname: load `cloud-storage-bucket-takeover.md`.
- CNAME target is a PaaS app hostname (`*.herokuapp.com`, `*.azurewebsites.net`, `*.azurestaticapps.net`, `*.onrender.com`, `*.fly.dev`, App Engine-style): load `paas-app-name-takeover.md`.
- CNAME target is a static hosting platform (`*.github.io`, GitLab Pages, `*.netlify.app`, `*.vercel.app`, `*.surge.sh`, `*.web.app`/`*.firebaseapp.com`, `*.pages.dev`): load `static-site-host-takeover.md`.
- CNAME target is a CDN/edge hostname (`*.cloudfront.net`, `*.fastly.net`, Cloudflare Workers custom domain, Akamai edge): load `cdn-edge-takeover.md`.
- CNAME target is a SaaS custom-domain feature (Zendesk, Shopify, Statuspage, Help Scout, UserVoice, Unbounce/Instapage, Tumblr, WordPress.com, Webflow, ReadMe, Intercom): load `saas-custom-domain-takeover.md`.
- CNAME target is a managed load balancer or traffic-routing hostname with a provider-assigned random suffix (`*.elb.amazonaws.com`, `*.trafficmanager.net`, similar): load `non-claimable-provider-patterns.md` before spending further time on it.
- The whole domain's NS records point to a DNS host/zone that itself looks deprovisioned (not just one CNAME): load `ns-delegation-takeover.md` — treat this as materially higher severity and higher caution than a single dangling CNAME.
- MX record points to a mail-filtering/hosting provider hostname that's NXDOMAIN: load `mx-record-takeover.md`.
- SPF `include:` or a DKIM selector CNAME references a third-party service hostname that's NXDOMAIN: load `spf-dkim-dangling-include.md`.
- Many permutation/brute-forced hostnames on the same base domain all return identical live content, or the base domain's own NS records point somewhere unexpected: load `wildcard-and-parking-false-positives.md` before treating any of them as individual findings.
- A CNAME target has been classified genuinely claimable and you need to prove it without over-committing: load `claim-verification-and-safe-poc.md`.
- A claim has been verified (or evidence gathered) and it's time to write it up: load `impact-proof-and-reporting.md`.
- The task started from a broader recon/subdomain-enumeration pass rather than a pre-built host list: hand off list-building to the `web-fingerprinting` skill's `subdomain-enumeration.md` card, then bring the resulting host list back here for CNAME/dangling analysis.

## Decision Rules

- "Resolves to nothing on my local resolver" is not evidence of dangling — always re-confirm via a public resolver before concluding NXDOMAIN.
- "CNAME target is NXDOMAIN" is a hypothesis, not a finding, until the provider's claimability is established (`non-claimable-provider-patterns.md` vs the provider-specific cards) — many dangling CNAMEs point to auto-named resources (ELB/ALB/NLB, some managed proxies) that cannot be re-registered by an attacker.
- A domain-wide wildcard or a fully-parked apex domain produces the same "200 OK" signal across dozens of unrelated-looking hostnames; rule this out before treating a batch of permutation hostnames as individual findings.
- NS-level dangling delegation is a different, larger-blast-radius class than CNAME-level dangling (full zone control vs. one hostname) — route it to its own card and gate it more strictly.
- Do not move from "verified claimable" to an actual claim without the safe-PoC card's evidence-first approach and explicit manual approval per `safety.md`.
- Never propose social engineering as a discovery or exploitation mechanism.
