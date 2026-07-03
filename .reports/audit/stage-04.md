# Stage 04 — Database Audit

**Source of truth:** repository only.

---

## Schema inventory (verified)
25 `schema.prisma` files: 22 under `services/*`, 3 under `app/*`
(`app/activity-subgraph`, `app/social-subgraph`, `app/backend/src/database`).
Prisma pinned to `5.22.0` via `pnpm.overrides` (`package.json`).

---

## Findings

### P0-01 — Migrations are effectively absent; most services ship `.keep` placeholders
**Evidence:** Per-service migration inventory:
- `services/auth-service/prisma/migrations/` → contains only `.keep` (0 real migrations).
- `services/payments-service/prisma/migrations/` → only `.keep`.
- `services/users-service`, `ai-service`, `challenges-service`, `chat-service`, `coaches-service`, `courses-service`, `marketplace-service`, `monitoring-service`, `notifications-service`, `nutrition-service`, `predictive-service`, `vip-service`, `workouts-service`, `affiliate-service` → **0** real migrations.
- `services/certificate-service/prisma/migrations/` → only a `PLAN_stage08/` folder (a plan, not a migration).
- Only **5** schemas have a real `migration.sql`: `physio-service` (`000_init`), `content-service` (`20250707100000_init`), `certificate-service` (partial), `app/activity-subgraph`, `app/social-subgraph`.
- **Zero** `migration_lock.toml` files exist anywhere (`find services -name migration_lock.toml` → 0).
- 8 services (`activities`, `analytics-collector`, `analytics-service`, `assessments`, `booking`, `inbox`, `medical`, `rewards`) have a schema but **no migrations directory at all**.
**Why it is a problem:** Without migrations, production DB provisioning relies on `prisma db push` (see `package.json` `db:migrate:all` → `prisma migrate deploy || prisma db push --skip-generate`). `db push` is a dev tool: it applies destructive diffs with no history, no rollback, no drift detection. The missing `migration_lock.toml` means Prisma cannot verify provider consistency. There is no reproducible schema history for 20 of 25 databases.
**Production impact:** No safe, reproducible, reversible schema deployment. Data loss on schema change. Cannot roll back. This alone blocks production certification.
**Recommended fix:** Generate real `prisma migrate` histories with `migration_lock.toml` for every schema; forbid `db push` in prod.
**Effort:** L. **Risk:** Critical.

### P1-02 — Fallback to `prisma db push` in deploy script (data-loss risk)
**Evidence:** `package.json` script `db:migrate:all`: `... (npx prisma migrate deploy || npx prisma db push --skip-generate)`.
**Why it is a problem:** If `migrate deploy` fails (which it will — no migrations exist), the `||` silently runs `db push`, which force-syncs the schema and can **drop columns/tables** to match. In production this is silent data destruction.
**Production impact:** Catastrophic, silent data loss on deploy.
**Recommended fix:** Remove the `|| db push` fallback; fail loudly.
**Effort:** S. **Risk:** Critical.

### P1-03 — `User` model triplicated with independent definitions
**Evidence:** `model User` defined in `services/auth-service/prisma/schema.prisma`, `services/users-service/prisma/schema.prisma`, and `app/backend/src/database/prisma/schema.prisma`.
**Why it is a problem:** Three sources of truth for the core identity aggregate, each with potentially different columns, constraints, and PK strategy. No FK can span them (separate DBs). Referential integrity across the identity boundary is impossible.
**Production impact:** Identity drift; a user existing in auth DB but not users DB, etc.
**Recommended fix:** Single owner (auth or users) + read models elsewhere.
**Effort:** L. **Risk:** High.

### P2-04 — Idempotency/outbox rely on `$queryRawUnsafe`/`$executeRawUnsafe`
**Evidence:** `app/backend/src/infra/idempotency.prisma.repo.ts:10,15` and `outbox.prisma.repo.ts:12,19,27,34` use `$queryRawUnsafe`/`$executeRawUnsafe` against `idempotency_keys` / `outbox_events` tables.
**Why it is a problem:** These tables are referenced by raw SQL but there is **no migration** that creates them (see P0-01). At runtime the queries will fail with "relation does not exist" unless a hidden bootstrap runs. Parameters are positional (`$1`) so SQLi risk is low, but the tables' existence is unverifiable from the repo.
**Production impact:** Idempotency and outbox silently broken → duplicate side effects, undelivered events.
**Recommended fix:** Add migrations creating these tables; prefer typed Prisma models.
**Effort:** M. **Risk:** High.

### P2-05 — Indexes/constraints unverifiable at scale; PK strategy mixed
**Evidence:** `services/payments-service/prisma/schema.prisma` uses string UUIDs generated in app code via a hand-rolled `uid()` (`payments.service.ts:5-7`, `Math.random()`-based). `services/courses-service/src/courses.controller.ts:16` treats ids as `Number(id)` — integer PKs. So UUID vs Int PK strategy differs by service.
**Why it is a problem:** `Math.random()`-based UUIDs are **not** cryptographically unique and can collide under high concurrency; mixed PK strategy complicates cross-service joins/analytics.
**Production impact:** UUID collision → PK constraint violation or, worse, data overwrite; inconsistent id handling.
**Recommended fix:** Use `crypto.randomUUID()` / DB-generated UUIDs uniformly; standardize PK strategy.
**Effort:** M. **Risk:** Medium.

### P3-06 — Multiple stray migration roots
**Evidence:** Root `migrations/001_init_users.sql`, `docs/migrations/`, and per-service migration dirs coexist. Unclear which is authoritative.
**Recommended fix:** Remove non-authoritative copies.
**Effort:** S. **Risk:** Low.

---

## Positives
- Prisma version pinned centrally (`5.22.0`).
- `app/backend` raw SQL uses positional params (`$1`), not string concatenation.

## Stage score: **22/100** (Database)
The absent migration histories + `db push` fallback are the single most dangerous production finding in the repo.
