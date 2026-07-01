# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical implementation of the **Auth** domain now lives in the modular
monolith at `app/backend/src/auth` (`UserAuthModule` / `UserAuthService`),
per the approved domain-ownership map
(`.reports/architecture/DOMAIN-OWNERSHIP.md`).

The security-critical logic (argon2 hashing, selector/verifier refresh tokens,
rotation, reuse/theft detection, constant-time login) was ported
behaviour-preserving into the monolith and is covered by parity unit tests
(`app/backend/src/auth/__tests__/user-auth.service.spec.ts`). The only
substantive change is the persistence layer: the monolith core uses **Int**
primary keys.

## Why this service is not yet deleted

Retirement is gated (per the project's own rule) on:

1. **Runtime validation** of the monolith auth against a real Postgres
   (integration + E2E), which runs in CI (`full-pipeline.yml`, db-apply/e2e
   jobs) — not reproducible in the offline dev sandbox.
2. **Infrastructure rewire** so nothing still routes to this service:
   - `docker-compose.yml` — `auth-service` build + `api-gateway`'s
     `AUTH_SERVICE_URL` / `depends_on`
   - `k8s/svc-auth-service.yaml`, `k8s/secrets/auth-service.secret.yaml`
   - `observability/prometheus.yml` scrape target `auth-service:4103`

Once CI proves parity against real Postgres and the above references are
repointed at the monolith, this directory will be removed in a dedicated
retirement commit.

Do not add new features here.
