# Claim Verification & Safe PoC (Name-Availability Checks)

## When To Consider

- a dangling target has been classified `conditional`/claimable by a provider-specific card and now needs proof without over-committing
- a full resource claim is blocked by an obstacle (quota, billing verification, plan tier) and a lower-cost verification path is needed first

## Evidence To Collect

- a no-resource-created name-availability signal wherever the provider exposes one: a dedicated API (e.g. Azure's `Microsoft.Web/checknameavailability`), a CLI dry-run, or a portal's inline "name already exists" check surfaced before final provisioning
- if full provisioning is genuinely required to prove the finding: the minimum viable resource tier/plan (free/shared tier, smallest region footprint) and, if quota blocks it, whether switching region resolves it before requesting a quota increase (many hostnames are global regardless of the deployment region)
- a timestamp and screenshot/response-body capture of the availability result, since provider inventory changes over time and someone else could claim the name before a report is triaged

## False Positive Controls

- an available name is not proof the *specific dangling CNAME* actually points at what you think — re-confirm the CNAME chain immediately before and after any claim attempt, since the target org could fix the record at any time
- a quota error is not the same as a "name unavailable" error — read the specific error message; a quota wall blocks deployment but says nothing about whether the name itself is claimable, and shouldn't be reported as "not exploitable" without checking availability by another means first

## Safe Validation Boundary

- Name-availability checks that create no resource are automatic/no-approval-needed under `safety.md` and should always be tried before requesting quota increases or attempting full deployment.
- Actually provisioning the resource to serve live content is manual-gated: benign, clearly-labeled placeholder content only; capture evidence promptly; delete/release the resource as soon as evidence exists; never leave it live longer than needed.
- Never read data sent by real visitors (cookies, form submissions, OAuth callbacks) during the window the resource is claimed.

## Output Requirements

- Report whether availability was confirmed via a no-resource-created check or would require full deployment, and cite the exact API/flow used.
- If a full claim was completed, state the exact evidence captured and the timestamp the resource was released.
- Set `manual_gate_required: true` for any step beyond a no-resource-created availability check.

## Related Techniques

- [paas-app-name-takeover](./paas-app-name-takeover.md)
- [cloud-storage-bucket-takeover](./cloud-storage-bucket-takeover.md)
- [impact-proof-and-reporting](./impact-proof-and-reporting.md)
