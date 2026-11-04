# Path Normalization & METHOD {host/api}/PATH Output

Turn raw call sites into the final, deduplicated inventory in the required line format.

## When To Consider

- You have `{method, host, raw_path}` tuples and must emit the inventory.

## Evidence To Collect

- The dynamic segments of each path and their meaning: `` `/users/${id}` `` → `/users/{id}`; `"/orders/" + orderId` → `/orders/{orderId}`; `/items/${x.productId}` → `/items/{productId}` (keep the last identifier as the name).
- The static prefix vs. query string: split on `?`; keep the path, and record notable query params separately rather than inlining volatile values.
- Duplicates across chunks/files that collapse to the same `METHOD + host + path`.

## False Positive Controls

- Don't over-template: a real static segment like `/health` or `/v2` is not a variable — only convert interpolated/concatenated expressions.
- Different methods on the same path are distinct endpoints — key dedup on `METHOD + host + path`, not path alone.
- A leftover `${...}` you cannot name becomes `{var}` — never emit raw JS interpolation in the final line.

## Safe Validation Boundary

- Normalization is local string work; it sends nothing.

## Output Requirements

- Emit one line per endpoint as:
  ```
  METHOD {host/api}/PATH
  ```
  with `{host/api}` replaced by the resolved host (e.g. `GET https://api.target.com/v2/users/{id}`), or left literal `{host/api}` when unresolved. Sort grouped by host then path; dedupe; attach method-basis and confidence in the structured `endpoints` field. Example:
  ```
  GET    https://api.target.com/v2/users/{id}
  POST   https://api.target.com/v2/orders
  DELETE https://api.target.com/v2/orders/{orderId}
  ANY    {host/api}/internal/{service}/health
  ```

## Related Techniques

- [base-url-resolution](./base-url-resolution.md)
- [http-method-inference](./http-method-inference.md)
- [false-positives-and-noise](./false-positives-and-noise.md)
