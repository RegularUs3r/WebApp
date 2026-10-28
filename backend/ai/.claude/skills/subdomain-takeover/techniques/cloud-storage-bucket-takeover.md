# Cloud Storage Bucket Takeover (S3/Blob/GCS)

## When To Consider

- a dangling CNAME target matches an S3 virtual-hosted-style bucket name, an Azure Blob storage account hostname, or a Google Cloud Storage bucket hostname
- the naming convention suggests customer-chosen bucket/account names rather than a provider-random suffix

## Evidence To Collect

- the exact bucket/account/storage name embedded in the CNAME target
- confirmation the bucket/account doesn't currently exist (e.g. a request to the bucket's own endpoint returns a "NoSuchBucket"-style error rather than access-denied, which would indicate it still exists but is private)
- the storage/addressing conventions in force for the provider and region (naming rules, whether the classic virtual-hosted addressing style used by the old CNAME is still supported for new buckets)

## False Positive Controls

- an "access denied" response means the bucket/account still exists (owned by someone, possibly still the target) — this is not dangling, it's just private
- bucket/account names are globally unique per provider; a name that looks generic (e.g. matches a common word) may already be squatted by an unrelated third party, not available for you to claim

## Safe Validation Boundary

- Confirming non-existence via the storage provider's own error responses is passive and safe.
- Creating a bucket/storage account with the exact target name is a real resource claim — manual-gated per `safety.md`. Prefer the provider's name-availability signal (where one exists) before creating anything.
- If a claim is approved and completed, upload only a benign placeholder object/page for evidence, then delete the bucket/account promptly.

## Output Requirements

- Name the exact bucket/account name and the provider-specific evidence it's unclaimed (not merely private).
- State whether a completed claim is planned and confirm manual approval was obtained before any creation step.

## Related Techniques

- [cname-fundamentals-and-triage](./cname-fundamentals-and-triage.md)
- [claim-verification-and-safe-poc](./claim-verification-and-safe-poc.md)
