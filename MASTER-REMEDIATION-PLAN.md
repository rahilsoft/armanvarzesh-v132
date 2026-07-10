# MASTER REMEDIATION PLAN

**Repository:** `rahilsoft/armanvarzesh-v132`
**Companion to:** `FINAL-CERTIFICATION.md` (verdict: ❌ NOT Production Ready)
**Date:** 2026-07-10
**Scope:** Documentation only. No code changed. Each item cites files verified at `main` @ `64e2dce`.

## Strategic decision required first (blocks P0 sequencing)

Every P0 below lives in `services/*`, while the hardened equivalent already exists in `app/backend`. Before fixing, the owner must choose the target topology:

- **Path A — Monolith is production (recommended).** Repoint deploy/CI/Helm/k8s at `app/backend`; remove `services/*` from the deploy path; then delete deprecated services. Most P0s become moot because the vulnerable code is no longer deployed. Smallest security surface.
- **Path B — Keep services live.** Then every P0 below must be fixed *in the services*, including the 5 active ones. Largest effort.

The plan below is written so P0-A (decommission/repoint) and P0-B (in-place fix) are both expressed; do the one matching the chosen path. **Active-service defects (P0-2 subset) must be fixed regardless of path**, because those services are not deprecated.

---

## P0 — Release blockers

### P0-1 · Trusted `x-user-id` / `x-role` header auth (IDOR / privilege escalation)
- **Root cause:** resolvers derive identity from client headers when no bearer token present. `services/content-service/src/plan/plan.resolver.ts:61-62` (`ctxRole`/`ctxUser`), +20 files.
- **Files:** `services/content-service/src/**/*.resolver.ts`, `services/courses-service/src/courses.controller.ts`, `services/nutrition-service/src/**`, `services/affiliate-service`, `services/challenges-service`.
- **Risk:** Critical — account takeover, self-promotion to admin.
- **Fix (Path B):** replace header fallbacks with verified-JWT identity only; reject when no valid bearer. **Fix (Path A):** remove these services from the deploy path (they are all deprecated).
- **Effort:** A ≈ 0.5 d (deploy repoint); B ≈ 3–4 d (per-resolver rewrite + authz).
- **Rollback:** revert resolver commits / restore compose entries.
- **Validation:** request with forged `x-user-id`/`x-role` → 401/403. **Tests:** e2e authz test asserting header spoof is rejected.

### P0-2 · `JWT_SECRET` optional in env validation — **active services included**
- **Root cause:** `JWT_SECRET: Joi.string().min(16).optional()` and `DATABASE_URL … .optional()` in `services/*/src/config/env.validation.ts:2`.
- **Active services (must fix regardless of path):** `ai-service`, `chat-service`, `monitoring-service`, `notifications-service`, `predictive-service`. Plus deprecated `auth`, `content`, `courses`, `marketplace`, …
- **Risk:** Critical — services boot without a secret; auth degrades silently.
- **Fix:** make `JWT_SECRET` **required** (`.required()`, min 32) in production; fail-fast on boot when `NODE_ENV==='production'`.
- **Effort:** 0.5–1 d (schema edit across services + boot assertion).
- **Rollback:** revert env-validation change.
- **Validation:** boot with `JWT_SECRET` unset in prod mode → process exits non-zero. **Tests:** unit test on the env schema.

### P0-3 · Hardcoded fallback signing secrets (`'change_me'`, `'dev'`)
- **Root cause:** `services/certificate-service/src/certificate/certificate.service.ts:6,12` and `src/auth/roles.guard.ts:17` use `process.env.CERT_SECRET || 'change_me'` for **sign and verify**; `services/content-service/src/plan/plan.resolver.ts:61-62` uses `jwt.verify(…, process.env.JWT_SECRET || 'dev')`.
- **Risk:** Critical — trivial token forgery with a public constant.
- **Fix:** remove all `|| '…'` secret fallbacks; require the env var; pin `algorithms: ['HS256']` on `jwt.verify`.
- **Effort:** 0.5 d.
- **Rollback:** revert.
- **Validation:** grep shows no `|| 'change_me'|| 'dev'`; token signed with the constant is rejected. **Tests:** unit test verifying forged-token rejection.

### P0-4 · Unsigned payment webhook (revenue fraud)
- **Root cause:** `services/payments-service/src/payments.controller.ts:15-17` processes webhooks with no signature check.
- **Risk:** Critical — forged `payment_succeeded` → free entitlements.
- **Fix (Path B):** port the monolith’s HMAC verification (`app/backend/src/common/security/webhook-signature.ts`) into the service. **Fix (Path A):** retire `payments-service`; the monolith’s verified checkout webhook is authoritative.
- **Effort:** A ≈ 0.25 d; B ≈ 1 d.
- **Rollback:** revert / restore service.
- **Validation:** unsigned/altered body → 401. **Tests:** webhook signature e2e (valid, missing, tampered).

### P0-5 · Missing migrations + `db push` data-loss fallback
- **Root cause:** 17 services have only `prisma/migrations/.keep`; root `package.json` `db:migrate:all` falls back to `prisma db push --skip-generate`.
- **Risk:** Critical — silent schema drift / data loss, no rollback.
- **Fix:** generate real migrations for every deployed DB; remove the `|| prisma db push` fallback from `db:migrate:all`. Under Path A, only the monolith DB matters.
- **Effort:** A ≈ 0.5 d (monolith only); B ≈ 2–3 d (per-service migration baselines).
- **Rollback:** migrations are additive; keep `down` where generated.
- **Validation:** `prisma migrate deploy` succeeds with no `db push`. **Tests:** migration replay in CI against ephemeral Postgres.

### P0-6 · Connection-pool exhaustion (115 `new PrismaClient()` in `services/*`)
- **Root cause:** per-module/per-request client instantiation across services.
- **Risk:** Critical at scale — Postgres connection exhaustion.
- **Fix (Path B):** single shared `PrismaService` per service (as the monolith already does). **Fix (Path A):** decommission services.
- **Effort:** A ≈ deploy repoint; B ≈ 2–3 d.
- **Rollback:** revert.
- **Validation:** `grep -rn "new PrismaClient(" services` → only seed scripts. **Tests:** load test asserting bounded connections.

---

## P1 — Must fix before scaling

- **P1-1 Deployment drift.** `docker-compose.yml` builds deprecated services and omits the monolith; CI (`ci-matrix.yml`, `ci-integration-services.yml`, `preview-real.yml`) and k8s (`k8s/*users-service*`) still reference services. **Fix:** add `app/backend` to compose/CI; remove deprecated-service entries. Effort 1–2 d. Validation: `docker-compose config` shows only monolith + infra.
- **P1-2 Non-authoritative lockfile.** `LOCKFILE_NOTE.txt`. **Fix:** run `pnpm install && pnpm dedupe`, commit a real lockfile, delete the note. Effort 0.5 d. Validation: `pnpm install --frozen-lockfile` passes in CI.
- **P1-3 NestJS 10→11 forced skew.** Services declare `^10.x`; root override forces `11.1.4`. **Fix:** align declared versions to 11, or drop the override and pin per package. Effort 1–2 d. Validation: no override needed; `pnpm why @nestjs/common` shows one major.
- **P1-4 Wildcard CORS with credentials.** `CORS_ORIGIN … allow('*').default('*')` in service env schemas. **Fix:** explicit allowlist; disallow `*` with credentials. Effort 0.5 d.
- **P1-5 `jwt.verify` without `algorithms` pinning** (P0-3 sites and others). **Fix:** pass `{ algorithms: ['HS256'] }`. Effort 0.25 d.
- **P1-6 Root `start` broken.** `package.json:18,35` → `node dist/main.js`, but the monolith emits to `dist/app/backend/src/main.js`. **Fix:** correct or remove root start. Effort 0.1 d.

---

## P2 — Should fix soon
- **P2-1** 21 deprecated services still on disk and wired — decommission after P1-1 (Path A). Effort 1 d (deletion + wiring cleanup) once unreferenced.
- **P2-2** Dual Helm charts (`armanfit-backend` monolith + `users-service`/`graphql-gateway`) — remove retired charts. Effort 0.5 d.
- **P2-3** Health checks: confirm readiness/liveness split + DB/Redis probe on the monolith. Effort 0.5 d.
- **P2-4** Top-level directory sprawl (40+ dirs, duplicate `workflows/` vs `.github/workflows/`, stray root `src/`) — consolidate. Effort 1 d.

---

## P3 — Future improvement
- Federation gateway coverage of subgraphs; API versioning + idempotency headers on money endpoints; test-quality pass (remove placeholder/`expect(true)` specs); ADR consolidation; outbox relay worker (currently a stub in `services/workers`).

---

## Recommended sequence (Path A, recommended)
1. **P0-2 / P0-3 / P1-5** on the 5 *active* services (required on any path) — ~1 d.
2. **P1-1** repoint compose/CI/Helm/k8s at `app/backend`; add monolith to compose — ~1–2 d.
3. **P0-4 / P0-1 / P0-6 / P0-5** become moot as `services/*` leave the deploy path; then **P2-1/P2-2** delete deprecated services + charts.
4. **P1-2** commit a real lockfile; **P1-3** resolve NestJS skew; **P1-6** fix root start.
5. Re-run this certification. Target verdict: ✅ or ⚠ with documented residuals.

**Validation gate for re-certification:** monolith `build/typecheck/lint/unit` green (already true) + E2E green against real Postgres+Redis + `grep` proves zero deployed references to deprecated services + no optional/`||`-fallback secrets in any *deployed* service.
