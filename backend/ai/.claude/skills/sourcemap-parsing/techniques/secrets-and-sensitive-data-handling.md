# Embedded Secret & Sensitive Data Handling

Reconstructed source frequently contains more than endpoints — keys, tokens, internal hostnames, comments, sometimes real data. Handle these without ever using them.

## When To Consider

- During reconstruction/extraction you encounter credential-shaped strings, internal infrastructure references, or apparent user data.

## Evidence To Collect

- Credential shapes: `AKIA…`/`ASIA…` (AWS), `AIza…` (Google), `sk_live_…`/`pk_live_…` (Stripe), `ghp_…`/`github_pat_…`, `xox[baprs]-…` (Slack), JWTs, `Authorization: Bearer …`, `-----BEGIN … PRIVATE KEY-----`, connection strings, `.env`-style assignments.
- Internal-only hints: internal hostnames/IPs, admin/debug endpoints, feature flags, non-public base URLs — useful context, not for use.
- Author comments revealing logic/security assumptions.

## False Positive Controls

- Many "keys" in frontend code are intentionally public (publishable keys like Stripe `pk_live`, Google Maps browser keys, Firebase web config) — note them but don't overstate; distinguish from genuinely secret material (`sk_…`, private keys, server tokens that shouldn't be client-side).
- A JWT in source may be an expired/sample token — record shape, never replay to check.
- A string matching a secret regex may be a hash/UUID/asset id — confirm shape before flagging.

## Safe Validation Boundary

- Confirm existence, location, and shape only. **Never use, replay, decode-for-access, or validate** a secret — that is a hard gate in `safety.md`. Store a redacted reference (type + location + last 4), not the full value, in evidence.

## Output Requirements

- Record each as a `sensitive_exposures` entry with `manual_gate_required: true`; classify as likely-public vs. likely-secret; recommend escalation/rotation in reporting without demonstrating use.

## Related Techniques

- [reconstruct-source-tree](./reconstruct-source-tree.md)
- [base-url-resolution](./base-url-resolution.md)
- [overview](./overview.md)
