# SaaS Custom-Domain Takeover (Zendesk/Shopify/Statuspage/etc.)

## When To Consider

- a dangling CNAME target matches a SaaS product's custom-domain/host-mapping feature (Zendesk, Shopify, Statuspage, Help Scout, UserVoice, Unbounce/Instapage, Tumblr, WordPress.com, Webflow, ReadMe, Intercom, and similar)

## Evidence To Collect

- which SaaS product the CNAME target belongs to, and that product's current domain-connection/verification flow (many of these have tightened ownership verification since the original 2014-era wave of SaaS takeover writeups — a technique that worked historically may now require a TXT record or account-level proof the org itself would need to provide)
- whether the SaaS account/store/help-desk instance the domain used to map to still exists under a different, unclaimed identifier, or was deleted outright

## False Positive Controls

- do not assume a historically-documented vendor takeover technique still works unmodified — verify current behavior against the vendor's own docs before relying on it
- some of these products bind the custom domain to a specific account rather than a freely renameable slug, meaning the "takeover" is really "get a free trial account and connect the domain," which may have different program-scope implications worth flagging to the requester

## Safe Validation Boundary

- Reading the vendor's current custom-domain documentation and checking whether a fresh trial/account could plausibly claim the mapping is a safe, no-commitment step.
- Actually creating a trial account and connecting the domain to complete a claim is manual-gated per `safety.md`: benign placeholder only, minimum time connected, then disconnect/delete.

## Output Requirements

- Name the SaaS product and cite its current (re-verified, not assumed-from-2014) domain-connection requirement.
- If a full claim is proposed, confirm manual approval first.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [claim-verification-and-safe-poc](./claim-verification-and-safe-poc.md)
