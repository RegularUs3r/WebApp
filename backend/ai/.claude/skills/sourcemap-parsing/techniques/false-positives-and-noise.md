# Third-Party & False-Positive Noise Control

A raw extraction is noisy. Scope the inventory to the target's own API before reporting.

## When To Consider

- The endpoint list contains analytics/CDN/library URLs, example endpoints, or more hosts than the target owns.

## Evidence To Collect

- The set of hosts appearing across extracted URLs, and which belong to the target vs. third parties.
- Known third-party hosts to drop by default unless in scope: `google-analytics.com`, `googletagmanager.com`, `doubleclick.net`, `sentry.io`, `segment.com/io`, `intercom.io`, `stripe.com`, `facebook.com`, `hotjar.com`, `cloudflareinsights.com`, font/CDN hosts.
- Non-production provenance: paths from `*.test.*`, `*.spec.*`, `*.stories.*`, `__mocks__`, `/node_modules/` sources, or commented-out code.

## False Positive Controls

- A target-owned analytics subdomain may still be in scope — classify by ownership, not just by "looks like analytics".
- Example/docs URLs (`example.com`, `localhost`, `127.0.0.1`, `api.example`) are placeholders, not live endpoints — drop or clearly mark.
- The same path on a third-party host vs. the target host are different findings — keep the host attached (this is why the format is `METHOD {host/api}/PATH`, not bare paths).

## Safe Validation Boundary

- Classification is static. Deciding a third-party host is "interesting" does not authorize probing it — out-of-scope hosts require separate authorization per `safety.md`.

## Output Requirements

- Present a first-party endpoint inventory; optionally keep a separate, clearly-labeled third-party section. Never silently merge third-party endpoints into the target's surface.

## Related Techniques

- [base-url-resolution](./base-url-resolution.md)
- [path-normalization-and-output](./path-normalization-and-output.md)
- [reconstruct-source-tree](./reconstruct-source-tree.md)
