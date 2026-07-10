# FINAL CERTIFICATION — Master Repository Audit v2.0

**Repository:** `rahilsoft/armanvarzesh-v132`
**Audit branch:** `claude/repository-certification-audit-v2` (cut from `main` @ `64e2dce`)
**Date:** 2026-07-10
**Method:** Read-only. Verified only from the current repository state. No prior report, commit message, or PR trusted. Every finding cites on-disk evidence reproduced at HEAD. Where a claim could not be proven in this environment it is marked **Not Proven** (no guessing).

---

## VERDICT: ❌ Repository NOT Production Ready

The repository contains a **genuinely hardened modular monolith** (`app/backend`) whose full quality gate passes — but it ships **alongside 32 `services/*` microservices that still carry 6 confirmed P0 defects**, and the **deployment topology points at the vulnerable services, not the monolith**. The two topologies have not been reconciled, so the artifact that a `docker-compose up` / CI / Helm path would actually deploy is the insecure one.

Crucially, the P0 defects are **not confined to deprecated code**: five *active* (non-deprecated) services also carry an insecure auth configuration (see Security §P0-2). Production readiness cannot be certified while a `git clone` + documented deploy path stands up services vulnerable to account takeover and revenue fraud.

---

## Repository graph (STEP 2 — evidence)

| Dimension | Count | Evidence |
|---|---:|---|
| `services/*` | 32 | `ls -d services/*/` |
| — deprecated (`DEPRECATED.md`) | 21 | `ls services/*/DEPRECATED.md \| wc -l` → 21 |
| — active (no `DEPRECATED.md`) | 11 | `activities, ai, analytics, api-gateway, chat, graphql-gateway, media-worker, monitoring, notifications, predictive, workers` |
| `app/*` | 10 | `ls -d app/*/` |
| `packages/*` | 33 | `ls -d packages/*/` |
| `contracts/*` | 10 | `ls -d contracts/*/` |
| Prisma schemas | 50 | `find . -name schema.prisma \| grep -v node_modules` |
| Dockerfiles | 85 | `find . -iname 'Dockerfile*' \| grep -v node_modules` |
| CI workflows | 28 | `ls .github/workflows/*.y*ml` |
| TS/TSX (source) | ~2,481 | `find . -name '*.ts' -o -name '*.tsx'` (excl. node_modules/dist/generated) |

Two parallel topologies coexist with **no canonical owner declared in deploy config**: the folded monolith `app/backend`, and the original `services/*` fleet.

---

## Scorecard (STEP 13)

Each score is backed by the cited evidence in the sections below. Scores are for the **repository as a deployable whole**, not the monolith in isolation.

| Dimension | Score /100 | Basis (evidence) |
|---|---:|---|
| Architecture | 40 | Dual monolith/service topology unreconciled; deploy config targets services not monolith (§Deploy) |
| Security | 20 | 6× confirmed P0 (trusted-header auth, optional JWT_SECRET incl. 5 active services, `'change_me'`/`'dev'` fallback secrets, unsigned payments webhook) (§Security) |
| Infrastructure | 38 | `docker-compose.yml` builds deprecated services, monolith absent; Helm exists for both monolith and a deprecated service; CI still references `services/` (§Infra) |
| Performance | 40 | 115 `new PrismaClient()` in `services/*` → pool exhaustion; monolith clean (§Perf) |
| Code Quality | 55 | Monolith folded code clean; `services/*` retains header-auth, inline JWT helpers |
| Maintainability | 45 | 21 deprecated services still on disk + wired; doc/config sprawl (40+ top-level dirs) |
| DDD / Boundaries | 45 | Monolith modular; but domains duplicated across monolith + services (dual bounded contexts) |
| Production Readiness | 25 | Deploy path stands up vulnerable services; monolith not in compose (§Deploy) |
| Deployment Readiness | 35 | Monolith Helm chart present; compose/CI drift; non-authoritative lockfile |
| Scalability | 30 | Per-request Prisma clients + in-memory patterns in `services/*` |
| Technical Debt (higher = less) | 30 | 21 deprecated-but-wired services; NestJS 10-declared/11-forced skew |
| **OVERALL** | **36** | **Grade F — Not Certified** |

---

## Runtime verification (STEP 4 — evidence-positive & negative)

**Monolith `app/backend` — all gates PASS (verified at HEAD `64e2dce`):**

| Gate | Result | Command |
|---|---|---|
| `typecheck` | ✅ exit 0 | `npm run typecheck` (`tsc -p tsconfig.build.json --noEmit`) |
| `build` | ✅ exit 0 | `npm run build` (emits `dist/app/backend/src/main.js`) |
| `lint` | ✅ exit 0 | `npm run lint` (eslint) |
| unit tests | ✅ 115 passed, 0 fail (69 skipped) | `npm test` → 35 suites pass |

**Not Proven in this environment:**
- `docker build` / `docker-compose` — **Not Proven** (no Docker daemon: `docker build` → `Cannot connect to the Docker daemon`).
- Full E2E green — **Not Proven** (no Postgres binary; `DATABASE_URL` unset). The E2E suite *compiles* and the monolith *boots through its full DI graph + GraphQL schema*; the remaining specs fail only on `ECONNREFUSED 127.0.0.1:6379` (Redis) and missing `DATABASE_URL`.
- `helm template` / `pnpm audit` advisory scan — **Not Proven** offline.

---

## Security audit (STEP 6) — 6 confirmed P0

All reproduced from the current repository. **Bold** = affects *active* (non-deprecated) services.

### P0-1 · Broken access control via trusted `x-user-id` / `x-role` headers (IDOR / privilege escalation)
Identity is taken from client-controlled headers when no bearer token is present.
- Evidence: `services/content-service/src/plan/plan.resolver.ts:61-62` —
  `ctxRole`/`ctxUser` fall back to `h['x-role']` / `h['x-user-id']`.
- Present in **20 files** (`grep -rln "x-user-id\|x-role"`), incl. `courses-service`, `nutrition-service`, `affiliate-service`, `challenges-service`, `content-service` (10+ resolvers).
- The single `app/backend` hit is a **comment only** (`wearables.controller.ts:17` — "the former x-user-id … is gone"); the monolith is not affected.
- Impact: any caller sets `x-user-id: <victim>` / `x-role: admin` → act as any user / self-promote.

### P0-2 · `JWT_SECRET` optional in env validation — **incl. active services**
- Evidence: `services/*/src/config/env.validation.ts:2` — `JWT_SECRET: Joi.string().min(16).optional()` and `DATABASE_URL: Joi.string().uri().optional()`.
- **Active services affected:** `ai-service`, `chat-service`, `monitoring-service`, `notifications-service`, `predictive-service` (plus deprecated `auth`, `content`, `courses`, `marketplace`, …).
- Impact: services boot with **no JWT secret** → auth silently degrades.

### P0-3 · Hardcoded fallback signing secrets (trivial token forgery)
- Evidence: `services/certificate-service/src/certificate/certificate.service.ts:6,12` — `jwt.sign(payload, process.env.CERT_SECRET || 'change_me')` **and** `jwt.verify(token, … || 'change_me')`; same in `services/certificate-service/src/auth/roles.guard.ts:17`.
- Evidence: `services/content-service/src/plan/plan.resolver.ts:61-62` — `jwt.verify(t, process.env.JWT_SECRET || 'dev')`.
- Impact: attacker signs their own admin token with the known fallback → full forgery.

### P0-4 · Payment webhook has no signature verification (revenue fraud)
- Evidence: `services/payments-service/src/payments.controller.ts:15-17` — `@Post('webhook') webhook(@Body() body …){ return this.svc.webhook(...) }` — no `signature`/`hmac`/`verify` anywhere in the controller.
- Impact: forged `payment_succeeded` → free entitlements. (The monolith’s `app/backend` checkout webhook *does* verify HMAC — this is the un-migrated twin.)

### P0-5 · Migrations absent for most service DBs + `db push` data-loss fallback
- Evidence: 17 services carry only `prisma/migrations/.keep`; only 2 have a real `migration.sql`. Root `package.json` `db:migrate:all` = `prisma migrate deploy || prisma db push --skip-generate`.
- Impact: schema drift applied via `db push` → silent column drops, no rollback.

### P0-6 · Connection-pool exhaustion — 115 `new PrismaClient()` in `services/*`
- Evidence: `grep -rn "new PrismaClient(" services` → 115. The monolith’s 13 hits are fold-doc comments + legitimate seed scripts; runtime uses injected `PrismaService`.
- Impact: per-module/per-request clients exhaust Postgres connections under load.

### Additional confirmed security items (P1)
- Wildcard CORS / `origin:'*'` defaults in service env schemas (`CORS_ORIGIN: Joi.string().allow('*').default('*')`).
- Inline `jwt.verify` without `algorithms` pinning in service resolvers/guards (P0-3 sites).

---

## Deployment & Infrastructure audit (STEP 7 / 10 / 11 / 12)

### The deploy path targets the vulnerable topology
- `docker-compose.yml` **builds `./services/auth-service`** and wires `AUTH_SERVICE_URL`/`USERS_SERVICE_URL` (`docker-compose.yml:109-142`). The monolith `app/backend` is **absent** from `docker-compose.yml` (`grep -nE "app/backend|backend:" docker-compose.yml` → none).
- Helm: `helm/armanfit-backend/` exists (monolith — image/TLS/env-secret templates) **and** `helm/users-service/` (a *deprecated* service) + `helm/graphql-gateway/`. Both topologies are deployable; nothing declares which is authoritative.
- CI still references `services/`: `.github/workflows/ci-matrix.yml`, `ci-integration-services.yml`, `preview-real.yml`.
- k8s manifests for deprecated services remain: `k8s/users-service.yaml`, `k8s/svc-users-service.yaml`.

### STEP 11 — Deprecated-service disposition (mechanical)
21 of 32 services carry `DEPRECATED.md`. **None is currently `SAFE TO DELETE`** — every sampled one is still referenced by at least one of: `docker-compose.yml`, Helm (`helm/users-service`), k8s manifests, or CI workflows. Disposition: **BLOCKED FROM DELETION** until compose/CI/Helm/k8s are repointed at the monolith.

### STEP 12 — Zero-hidden-dependency: **FAILED**
Remaining references to deprecated services exist in: `docker-compose.yml`, `helm/users-service/*`, `k8s/*users-service*`, and CI workflows. The claim "migrated into `app/backend`, services retired" is **true in code but not in deployment wiring**.

---

## Version & supply-chain audit (STEP 8)
- **Non-authoritative lockfile:** `LOCKFILE_NOTE.txt` states "This is NOT a real pnpm-lock.yaml." Reproducible installs are not guaranteed from the committed lockfile as-declared.
- **NestJS major skew:** `services/*/package.json` declare `@nestjs/common ^10.x` (23 occurrences across 10.3–10.4) while root `pnpm.overrides` **forces `11.1.4`**. Services are authored against Nest 10 but resolved to Nest 11.
- Advisory/`pnpm audit` scan — **Not Proven** (offline).

---

## Performance audit (STEP 9) — evidence
- 115 per-service `new PrismaClient()` (§P0-6) → pool pressure; monolith uses a shared injected client.
- Deeper N+1 / blocking-I/O sweep across all `services/*` — **Not Proven** at this depth in one pass; the monolith’s folded services use batched queries and a `LoaderFactory` DataLoader.

---

## Evidence-positive (what IS solid)
- `app/backend` monolith: **build ✓ typecheck ✓ lint ✓ 115 unit ✓** at current `main`.
- Monolith security wiring (from the prior, now-merged acceptance pass, re-confirmed present): global `JwtAuthGuard` + `@CurrentUser()`, HMAC-verified webhooks, `$transaction`-wrapped money/booking flows, corrected Dockerfile, injected `PrismaService` (0 problematic runtime `new PrismaClient()`).
- A production Helm chart for the monolith exists (`helm/armanfit-backend`).

---

## Certification conclusion

The engineering *inside* `app/backend` is production-grade. The **repository as a deployable whole is not**, because:
1. **6 P0 security defects** remain in `services/*` — and **5 active services** share the optional-JWT_SECRET defect (not just deprecated code).
2. The **deployment topology (compose/CI/k8s) still stands up the vulnerable services**, and the hardened monolith is not in the primary compose path.
3. Supply-chain reproducibility is unproven (non-authoritative lockfile) and there is a **NestJS 10→11 forced version skew**.

Remediation is tractable and is enumerated in `MASTER-REMEDIATION-PLAN.md`. Until the deploy topology is repointed at the monolith **and** the active-service auth defects are closed (or those services are removed from the deploy path), the verdict stands.

## ❌ Repository NOT Production Ready
