# Security Hardening — Phase 2

## What we added
- Global Helmet, CORS, ValidationPipe, and rate-limiting in NestJS bootstrap.
- `/healthz` and `/readyz` fallbacks at HTTP adapter level.
- `RbacGuard` + `@Roles()` decorator scaffold.
- JWKS endpoint: `/.well-known/jwks.json` (inject `PUBLIC_JWKS_JSON` via env/secrets).
- Admin IP allowlist middleware (`/admin` scope).
- CI: Gitleaks + TruffleHog (fail-closed).

## Required env (examples)
```
CORS_ORIGIN=https://app.example.com,https://admin.example.com
RATE_WINDOW_MS=60000
RATE_MAX=120
ADMIN_IP_ALLOWLIST=10.0.0.,192.168.
PUBLIC_JWKS_JSON={"keys":[{...}]}
```
