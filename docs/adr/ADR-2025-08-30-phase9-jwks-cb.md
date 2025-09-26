
# ADR — Phase 9 (JWKS JWT verification + Circuit Breaker)

## Decision
- Prefer JWKS verification (remote public keys via `JWKS_URL`) with cache (5m) and `kid` support.
- Fallback to HS secret via `JWT_SECRET` if JWKS not configured.
- Device-binding remains enforced when `REQUIRE_DEVICE_ID=true`.
- Added a coarse circuit-breaker wrapper for `fetch`: timeout, retry, open/half-open logic.

## Rationale
- Org-grade identity providers rotate keys; JWKS avoids secret sprawl.
- Circuit breaker reduces cascading failures during upstream incidents.

## Ops
- Set `JWKS_URL` in Gateway env; rotate cache TTL per risk appetite.
- Tune CB thresholds per-service when extracting gateway adapters.
