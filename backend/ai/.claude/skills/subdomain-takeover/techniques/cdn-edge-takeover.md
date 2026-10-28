# CDN / Edge Takeover (CloudFront/Fastly/Workers/Akamai)

## When To Consider

- a dangling CNAME target is a CDN/edge hostname (`*.cloudfront.net`, `*.fastly.net`, a Cloudflare Workers custom domain, an Akamai edge hostname)

## Evidence To Collect

- for CloudFront specifically: the CDN hostname itself is provider-assigned per distribution and is **not** reclaimable — the actual claimable surface, if any, is the distribution's *origin* (frequently an S3 bucket). If the origin is dangling, route to `cloud-storage-bucket-takeover.md` instead of treating the CloudFront hostname itself as the target.
- for Fastly: whether the service/domain mapping is still bound to an active service, and whether Fastly's current account/domain-verification model would actually let a new account claim the same domain mapping
- for Cloudflare Workers / Cloudflare for SaaS: whether the zone is using custom hostnames (SSL for SaaS) and the backing worker/app was deprovisioned while the custom hostname mapping was left in place

## False Positive Controls

- do not conflate "the CDN hostname resolves fine" with "the origin behind it is healthy" — a live CDN distribution can still front a dangling origin (5xx from the CDN, or a CDN-level "origin not found" page, is the actual signal to look for)
- CDN-level dangling is often two hops removed from the visible CNAME; trace the full chain before concluding there's nothing here

## Safe Validation Boundary

- Passive inspection of CDN error pages/behavior is safe and generates no more load than a normal page view.
- Claiming the underlying origin resource (bucket, worker, app) follows that resource type's own card and safety gate — this card is about correctly routing to it, not a claim procedure of its own.

## Output Requirements

- State explicitly whether the CDN hostname itself or its origin is the actual dangling/claimable surface.
- Route to the origin-specific technique card before making any claimability call.

## Related Techniques

- [cloud-storage-bucket-takeover](./cloud-storage-bucket-takeover.md)
- [non-claimable-provider-patterns](./non-claimable-provider-patterns.md)
- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
