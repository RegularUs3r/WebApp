# PaaS App Name Takeover (Heroku/Azure App Service/etc.)

## When To Consider

- a dangling CNAME target matches a PaaS platform's app-hostname convention (`*.herokuapp.com`, `*.azurewebsites.net`, `*.azurestaticapps.net`, `*.onrender.com`, `*.fly.dev`) where the name portion is customer-chosen at app-creation time
- `provider-fingerprints.json` marks the matched pattern `conditional`

## Evidence To Collect

- the exact app name embedded in the CNAME target
- a name-availability signal that doesn't require creating anything, if the provider exposes one (e.g. Azure's `Microsoft.Web/checknameavailability` REST operation, or a portal/CLI's inline "name already exists" check surfaced before any resource is actually provisioned)
- if going further: whether your own account currently has the quota/plan needed to actually provision an app in this platform — many free/trial accounts start with zero compute quota specifically to slow down abuse patterns like this one

## False Positive Controls

- "the app doesn't currently resolve" doesn't mean the name is available — some platforms release the DNS binding before the name itself becomes reclaimable, or vice versa; use the platform's actual name-availability signal, not just DNS state
- a name that looks generic/short may already be squatted by an unrelated third party

## Safe Validation Boundary

- Prefer a no-resource-created name-availability check over full deployment. On Azure specifically, `az rest --method post --url ".../providers/Microsoft.Web/checknameavailability?api-version=2022-03-01" --body '{"name":"<app>","type":"Microsoft.Web/sites"}'` needs only Reader-level auth and consumes no VM/compute quota — this is the default first move, not full app creation.
- If quota blocks full deployment, try a different region before requesting a quota increase (the claimed hostname isn't region-scoped); a support-ticket quota increase is often the slower path and may require account/payment verification on brand-new subscriptions — that friction is intentional abuse prevention, not a signal anything's wrong with the approach.
- Actually provisioning the app to serve live content is manual-gated per `safety.md`: benign placeholder content only, minimum time live, then delete.

## Output Requirements

- Name the exact app name, the platform, and whether availability was confirmed via a no-resource-created check or would require full deployment to verify.
- If a full-deployment claim is proposed, confirm manual approval was obtained first.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [claim-verification-and-safe-poc](./claim-verification-and-safe-poc.md)
- [non-claimable-provider-patterns](./non-claimable-provider-patterns.md)
