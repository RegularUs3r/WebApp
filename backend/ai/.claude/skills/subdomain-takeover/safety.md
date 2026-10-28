# Subdomain Takeover Safety

## Hard Gates

- Authorized testing only.
- Stay within the confirmed scope; do not pivot to enumerate or claim hosts on domains not covered by the authorization.
- Do not actually register/claim a cloud resource, app name, bucket, or hosted page to prove a takeover without explicit manual approval — unlike most web vulnerability classes, a completed claim can receive real third-party traffic the moment DNS propagates.
- If a claim is approved and completed, never read `Set-Cookie` headers, form submissions, query strings, or any other data sent by real visitors to the claimed resource beyond what's strictly needed to confirm the takeover worked.
- Never use a claimed resource to intercept OAuth/SSO redirect or callback traffic, session tokens, or API credentials, even incidentally.
- Never serve misleading, credential-harvesting, or malware-style content on a claimed resource — a benign, clearly-labeled placeholder page only.
- Time-box any completed claim: capture the minimum evidence needed (screenshot, response headers, name-availability confirmation) and release/delete the resource as soon as that evidence exists; do not leave it live "just in case."
- Do not attempt to claim an NS-delegated zone (full DNS takeover) without separate, explicit manual approval beyond what a single CNAME claim would need — the blast radius (every record in the zone) is categorically larger.
- Do not send or receive mail through a dangling MX target without explicit manual approval.
- Do not use social engineering as a discovery or exploitation mechanism.
- Do not persist sensitive response bodies, cookies, tokens, or any real visitor's data; store metadata, hashes, and response shapes only.

## Automatic Lane

Automatic work is limited to: DNS resolution and CNAME/NS/MX/TXT chain tracing against public resolvers; classifying a dangling target's provider and claimability using `provider-fingerprints.json` and the relevant technique card; wildcard/parking false-positive triage; name-availability checks that create no resource (e.g. a cloud provider's `checknameavailability`-style API, a portal's inline name-uniqueness check); passive WHOIS/registration-expiry lookups; hypothesis generation and severity/impact framing.

## Manual-Gated Lane

Manual approval is required for: actually registering/claiming any resource (bucket, app service, static-site project, custom domain slot) to complete a PoC; deploying any content, even a benign placeholder, to a claimed resource; leaving a claimed resource live beyond the minimum time needed to capture evidence; reading any data a real visitor sends to a claimed resource; claiming or interacting with a dangling NS delegation; sending/receiving mail via a dangling MX target; and expanding host enumeration beyond the initially authorized scope.

## Stop Conditions

Stop on: discovery of out-of-scope hosts/domains reached via pivoting; any indication a "claimable" resource is already claimed by someone else (do not attempt to displace or interfere with another party's claim, malicious or not — report it instead); evidence that completing a claim would expose real user data already in flight (e.g. the dangling host is still actively linked from the live production app); signs the domain is fully expired/parked at the registrar level rather than a single dangling record (recharacterize as a domain-expiry finding, not a subdomain takeover, and reassess whether it's even in scope); or any path that would require social engineering.
