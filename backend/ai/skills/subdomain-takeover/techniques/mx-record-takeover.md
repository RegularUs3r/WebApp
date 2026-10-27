# Dangling MX Takeover (Mail Interception)

## When To Consider

- a domain's MX record points to a mail-filtering/hosting/relay hostname that is itself NXDOMAIN or otherwise deprovisioned

## Evidence To Collect

- the exact MX hostname and priority, and confirmation via a public resolver that it's genuinely non-resolving (not a transient mail-provider outage)
- whether the mail-hosting/filtering product in question assigns customer-chosen relay hostnames (making a claim plausible) or provider-random ones (not claimable, similar to the ELB/ALB pattern)
- what depends on receiving mail at this domain: password-reset flows, account-recovery, SSO fallback, vendor account ownership verification — this is what turns a dangling MX into a serious escalation path rather than a curiosity

## False Positive Controls

- a domain can have multiple MX records at different priorities; a single dangling one is only exploitable if it's the one that would actually receive mail (check priority ordering and whether higher-priority records are healthy)
- some orgs intentionally leave a low-priority dangling MX as a deprecated fallback with no real mail flow — assess whether mail sent to the domain would plausibly ever reach this record before treating it as high severity

## Safe Validation Boundary

- Confirming the MX record and its resolution status is passive and safe.
- Actually claiming the mail-relay resource and receiving/sending mail through it is manual-gated per `safety.md` — this can intercept real password resets, 2FA codes, or account-recovery flows for real users, which is a much higher-harm action than serving a placeholder web page.
- If approved: receive the minimum mail needed to prove interception is possible, do not act on or forward any captured credentials/codes, document and hand back control immediately.

## Output Requirements

- State clearly what real-world flow (password reset, SSO, vendor verification) would be interceptable if this were claimed, since that's the actual severity driver.
- Require `manual_gate_required: true` for any claim or interception step.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [spf-dkim-dangling-include](./spf-dkim-dangling-include.md)
- [impact-proof-and-reporting](./impact-proof-and-reporting.md)
