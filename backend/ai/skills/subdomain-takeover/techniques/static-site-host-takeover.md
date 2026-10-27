# Static Site Host Takeover (Pages/Netlify/Vercel/Firebase)

## When To Consider

- a dangling CNAME target matches a static-hosting platform's project/site subdomain (`*.github.io`, GitLab Pages, `*.netlify.app`, `*.vercel.app`, `*.surge.sh`, `*.web.app`/`*.firebaseapp.com`, `*.pages.dev`) where the name is customer-chosen

## Evidence To Collect

- the exact project/org/repo/site name embedded in the target
- for GitHub/GitLab Pages specifically: whether the takeover depends on registering an org/user name or a repo name — the two have different claimability and squatting dynamics
- the platform's current custom-domain verification requirement (some platforms now require a verification TXT record or file in addition to the CNAME, which changes what a completed claim actually proves)

## False Positive Controls

- a project/site name being free on the hosting platform does not by itself confirm the domain's owner ever pointed a CNAME there intentionally versus it being an old, unrelated demo/test deployment — check whether the hostname naming pattern plausibly belongs to the target org
- some platforms squat-protect popular names or require identity verification before a claim takes effect — a "successfully created" project is not always immediately live at the custom domain

## Safe Validation Boundary

- Checking whether a project/site/repo name is available is normally a free, no-resource-commitment signal on most of these platforms (an inline "name taken" check) — treat this as the default first step.
- Creating the project and deploying a benign placeholder page to complete the claim is manual-gated: minimum time live, then delete, per `safety.md`.

## Output Requirements

- Name the exact project/site name, the platform, and whether a current custom-domain verification step (beyond the CNAME) would block a simple claim.
- If a full claim is proposed, confirm manual approval first.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [claim-verification-and-safe-poc](./claim-verification-and-safe-poc.md)
