
# CSP & Service Mesh mTLS

## CSP
- Default CSP via Helmet is permissive for inline styles. Set `STRICT_CSP=true` on API Gateway to remove `'unsafe-inline'` and require self-only.
- Ensure web/PWA bundles avoid inline styles or add nonces.

## Mesh mTLS (Istio)
- Label namespace for injection: `kubectl label ns <ns> istio-injection=enabled --overwrite`
- Enforce STRICT mTLS with `PeerAuthentication`.
- Limit east-west traffic with `AuthorizationPolicy`.

## Log Correlation
- Logs now include `trace_id=` when available; Loki datasource derives trace links to Tempo via `derivedFields`.
