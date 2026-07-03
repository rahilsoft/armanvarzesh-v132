# Phase 3 — Auth reference domain: migration report

Branch `claude/project-completion-prompt-0y30ok`. Reference domain for the
per-domain fold pattern. Canonical decision: **modular monolith, Int PKs**;
Auth logic **ported (not rewritten)** from `services/auth-service`.

## What moved, and where

| Artifact | From | To |
|---|---|---|
| Password hashing (argon2) | `services/auth-service/src/auth/auth.service.ts` | `app/backend/src/auth/user-auth.service.ts` |
| Selector/verifier refresh + rotation + theft detection | same | same (Int `userId`/`replacedById`) |
| Access-token `jti` issuance | same | same |
| Constant-time login (dummy-hash) | same | same |
| REST endpoints `/auth/register|login|refresh` | auth-service controller | `app/backend/src/auth/user-auth.controller.ts` |
| DI wiring (JwtModule/Passport/Prisma) | auth-service module | `app/backend/src/auth/user-auth.module.ts`, imported by `app.module.ts` |
| Persistence models | auth-service schema (uuid) | canonical schema (Int): `Session`, `RefreshToken`, `Device`, `PasswordResetToken` + `User.passwordHash/twoFactor*` |

## What was deleted, and why

- `app/backend/src/auth/auth.controller.ts` — an **unregistered** (dead) `/auth`
  REST controller backed by the env-based admin `AuthService`; a duplicate of
  the auth capability now canonicalised. Not imported by any module.

## What changed structurally

- Canonical Prisma schema gained the four auth models (Int keys, FK →
  `User.id`) and `User.passwordHash` + `twoFactorEnabled`/`twoFactorSecret`.
- `app/backend/tsconfig.json` gained the `@prisma/client` → local generated
  client path mapping (it was present in `tsconfig.build.json` but missing from
  `tsconfig.json`, so raw `tsc`/IDE resolved a *sibling* service's client). Now
  consistent; both resolve the canonical client.
- Admin auth (`/admin/login`, env-driven) is deliberately untouched — a
  separate path, as agreed.

## Classification of `content-service`-style artifacts

Not applicable to Auth (single-service domain). The auth-service's models were
**Duplicate** (User/Session/RefreshToken already conceptually owned by the core)
and its logic **Canonical** (ported verbatim).

## Verification (this commit)

- **Typecheck:** `app/backend` `tsc -p tsconfig.build.json --noEmit` → exit 0,
  against the regenerated canonical Prisma client (offline via
  `scripts/prisma-offline.sh`). A type probe confirmed `prisma.refreshToken`
  resolves and unknown models error → correct canonical client.
- **Unit tests:** `app/backend/src/auth/__tests__/user-auth.service.spec.ts` —
  7/7 pass (register+argon2, duplicate rejection, login accept/reject,
  user-enumeration resistance, rotation lineage, reuse/theft family-revoke,
  malformed token).
- **Build/lint:** unaffected (additive module; no existing code paths changed
  besides deleting one dead controller).

## Not done in this commit (gated, tracked)

Physical retirement of `services/auth-service` is **staged** (see
`services/auth-service/DEPRECATED.md`) pending:
1. Integration + E2E validation against real Postgres in CI.
2. Infra rewire: `docker-compose.yml` (`api-gateway` `AUTH_SERVICE_URL`),
   `k8s/svc-auth-service.yaml` + secret, `observability/prometheus.yml`.

This respects the rule *"only after all references, tests, and runtime
validation pass may auth-service be retired."*

## Technical-debt delta

- Progressed D1/D2 for the Auth slice: one canonical Auth implementation +
  canonical auth models with Int keys.
- New follow-up: **AUTH-RETIRE** — delete auth-service + repoint infra after CI
  validation.
- Note: legacy admin-env auth cluster (`auth.service.ts`, `auth.resolver.ts`,
  `local.strategy.ts`) remains unregistered/dead — slated for the Users/admin
  phase, not removed here to keep this commit scoped.
