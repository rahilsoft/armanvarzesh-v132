# Stage 03 — Code Quality

**Source of truth:** repository only. Counts are from repo-wide `grep`/`find`.

---

## Quantified debt (verified counts)

| Signal | Count | How measured |
|---|---|---|
| `TODO` / `FIXME` / `HACK` | **444** | grep `.ts`/`.tsx` in src trees |
| `: any` annotations | **620** | grep src trees |
| `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck` | **7** | grep src trees |
| `eslint-disable` | **28** | grep src trees |
| `new PrismaClient()` call sites | **86** | grep src trees |
| `console.log` in service source (excl. tests/scripts/seed) | **102** | grep |
| Skipped/`xit`/`it.todo` tests | **89** | grep |
| `.keep` placeholder files | **17** | find |

---

## Findings

### P1-01 — 86 independent `new PrismaClient()` instantiations
**Evidence:** `grep -rn "new PrismaClient"` → 86 files, e.g. `services/payments-service/src/payments.service.ts:13` (`prisma = new PrismaClient();`), `services/ai-service/src/ai.service.ts`, `services/chat-service/src/chat/chat-persistence.service.ts`, `services/booking-service/src/booking.service.ts`, and every `prisma/seed.ts`.
**Why it is a problem:** Each `PrismaClient` opens its own connection pool. Multiple instances per process (service + persistence + readiness all `new PrismaClient()`) multiply pool count. Under load this exhausts Postgres `max_connections`. It also bypasses NestJS DI, so no lifecycle `$disconnect`, no shared transaction context.
**Production impact:** Connection-pool exhaustion at scale; DB refuses connections; cascading 500s. Directly blocks the "millions of users" goal.
**Recommended fix:** Single injectable `PrismaService` (Nest `OnModuleDestroy`) per process, one client, shared pool config.
**Effort:** M. **Risk:** High.

### P1-02 — Money/booking multi-write flows are unguarded by transactions in `services/*`
**Evidence:** `grep "\$transaction" services/payments-service/src services/booking-service/src` → **no matches**. `services/payments-service/src/payments.service.ts` `webhook()` performs 4 sequential writes (create `paymentEvent`, update `checkoutSession`, create `order`, upsert `subscription`, create outbox) with **no `$transaction`** (lines 39–62).
**Why it is a problem:** A crash between the `order` create and the `subscription` upsert leaves inconsistent financial state — order recorded but no entitlement, or double-charge on retry.
**Production impact:** Financial inconsistency, orphaned orders, missing entitlements. (Note: `app/backend` payments *do* use transactions per prior commit `39d5976`, but the `services/` copy does not — reinforcing Stage-02 dual-topology risk.)
**Recommended fix:** Wrap the webhook money-flow in `prisma.$transaction`.
**Effort:** M. **Risk:** High.

### P2-03 — `node-fetch@^1.0.0` pinned in a service (broken/ancient dependency)
**Evidence:** `services/content-service/package.json:62` → `"node-fetch": "^1.0.0"`. `services/payments-service/package.json:27` → `"node-fetch": "^3.3.2"`.
**Why it is a problem:** `node-fetch@1.x` is from 2016, EOL, has known vulnerabilities, and `^1.0.0` will also happily resolve to any 1.x. Two different major versions across services indicates no dependency governance.
**Production impact:** Vulnerable HTTP client; inconsistent fetch semantics.
**Recommended fix:** Standardize on native `fetch` (Node 18+) or a single pinned `node-fetch@3`.
**Effort:** S. **Risk:** Medium.

### P2-04 — 620 `any` annotations; untyped request/context objects in auth-critical paths
**Evidence:** `services/content-service/src/plan/plan.resolver.ts:61-62` derive user identity from `ctx:any`; `app/backend/src/auth/admin.guard.ts:12` uses `claims:any`. 620 total `: any` occurrences.
**Why it is a problem:** `any` in auth/identity code defeats the type system exactly where correctness matters most; silent shape mismatches become runtime auth bugs.
**Production impact:** Latent auth/logic bugs; no compile-time safety.
**Recommended fix:** Introduce typed `RequestContext`/`AuthenticatedUser` and forbid `any` via lint in security paths.
**Effort:** L. **Risk:** Medium.

### P2-05 — `console.log` used as production logging (102 sites)
**Evidence:** e.g. `services/payments-service/src/main.ts:19` `console.log('[payments-service] listening on '+port)`; 102 non-test occurrences.
**Why it is a problem:** No structured logging, no levels, no correlation IDs on these lines; some may log request/PII data (see Stage 05). Inconsistent with the `@arman/observability-sdk` that services also import.
**Production impact:** Poor observability, potential PII leakage, log noise.
**Recommended fix:** Route through the structured logger uniformly.
**Effort:** M. **Risk:** Medium.

### P2-06 — 444 TODO/FIXME/HACK markers
**Evidence:** repo-wide count 444.
**Why it is a problem:** High unresolved-intent density for a "production tomorrow" codebase; each is a known-incomplete path.
**Recommended fix:** Triage; convert to tracked issues; resolve P0/P1-tagged ones before release.
**Effort:** L. **Risk:** Medium.

### P3-07 — Duplicated validators / env schema copy-paste across 19 services
**Evidence:** `services/*/src/config/env.validation.ts` is byte-identical Joi schema duplicated across ai, courses, users, coaches, vip, chat, nutrition, auth, monitoring, workouts, affiliate, marketplace, predictive, challenges, payments, content, notifications (17+ copies observed).
**Why it is a problem:** DRY violation; a validation fix must be made 17 times. Also note `JWT_SECRET: Joi.string().min(16).optional()` — **optional** in every service (Stage 05 P0).
**Recommended fix:** Extract to a shared `@arman/env-config` schema (which already exists as a package).
**Effort:** M. **Risk:** Low.

---

## Positives
- Only 7 `@ts-ignore` across ~2,400 files — low suppression rate.
- `argon2` used for password hashing in `services/auth-service` (Stage 05).

## Stage score: **40/100** (Code Quality)
The 86 `new PrismaClient()` and untransacted money flows are release-blockers.
