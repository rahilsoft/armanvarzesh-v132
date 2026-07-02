# Phase 4 — Workout domain: migration report

Branch `claude/project-completion-prompt-0y30ok`. Canonical: **modular monolith,
Int PKs**. This fold resolves the last `Workout ×3` duplication (D2).

## Artifact classification (workouts-service)

| Artifact | Class | Action |
|---|---|---|
| `WorkoutPlan`, `Exercise` models | Canonical (unique) | **Folded** into canonical schema |
| `Workout` structured columns (planId/date/sets/reps/weight/rpe/notes/mediaUrl) | Canonical (unique) | **Folded** — monolith `Workout` was `{title, data Json}` only |
| Plan/exercise CRUD + search + progress aggregation | Canonical (unique) | **Ported** to `WorkoutPlansService` (typed; the original's 16 `Promise<any>` removed, its `new PrismaClient()` replaced with injected `PrismaService`) |
| Session CRUD / REST aliases | Duplicate | Monolith `WorkoutsService` kept |
| service bootstrap (main/tracing/metrics) | Legacy infra | Retired with the service |

## activity-subgraph `Workout` (the 3rd duplicate)

**Not the same entity** — it is training-load telemetry (startedAt/minutes/
sRPE/avgHR/maxHR, cuid ids) actively used by the deployed subgraph's
`combinedLoad` resolvers. Renamed to `TrainingSession` with `@@map("Workout")`
(no DB change, zero downtime), code refs updated, client regenerated, subgraph
typecheck green. Name collision eliminated; Activity domain keeps its data.

## Defects found & fixed while folding (each now regression-tested)

1. **Monolith entity/schema lie:** the `Workout` GraphQL entity promised
   date/duration/sets/reps/rpe/weight/notes/mediaUrl but no such columns
   existed; the resolver stuffed input into the `data` JSON blob
   (`data: input as any`). Columns are now real; create/update persist them via
   a whitelisted `pickWorkoutFields` (blocks arbitrary keys). `as any` removed.
2. **Entity type mismatches:** `userId` non-null vs `Int?` column (runtime
   null-on-non-null GraphQL error waiting to happen); `rpe` typed Int vs Float.
   Both corrected; user resolve-field now guards null userId.
3. **`WorkoutsModule` was never wired into `app.module`** — the whole workout
   surface was dead code. Now wired (queries/mutations live in the GraphQL schema).
4. **Legacy `PaymentsService` idempotency bug** (found by making `npm test`
   real): the duplicate-payment `ConflictException` was thrown inside a `try`
   whose blanket `catch` swallowed it — duplicates were never rejected.
   Exception now rethrown; covered by the rewritten spec.

## Migrations (real files)

`app/backend/src/database/prisma/migrations/`:
- `migration_lock.toml` (postgresql)
- `0_init/migration.sql` (815 lines) — baseline: empty → pre-Workout canonical
  schema (46 models), generated with `prisma migrate diff --from-empty`
- `20260702000001_workout_domain_fold/migration.sql` (54 lines) — ALTER
  Workout (9 columns + data DROP NOT NULL) + CREATE WorkoutPlan/Exercise +
  indexes + FKs, generated with `prisma migrate diff --from-schema-datamodel
  <pre> --to-schema-datamodel <post>`

## Test estate (made `npm test` real)

`app/backend` `test` script was `echo "No tests yet" && exit 0`. Now:
- `test` → `jest src` (unit gate): **9 suites / 36 tests green**, including the
  new 9-test workout suite.
- `test:e2e` → e2e suites (require live HTTP/Postgres; run in CI).
- `test:legacy` → quarantined pre-existing `test/` scaffold stubs written
  against long-gone APIs (~11 failing suites; tracked as **D17 TEST-ESTATE**).
- Repaired 3 previously-unrunnable specs: `nulls.spec` (tested a function that
  never existed), `result.spec`/`payments.service.spec` (broken import paths);
  payments spec rewritten against the real raw-SQL implementation.

## Verification (executed this commit)

- `npm run typecheck` (backend, tsconfig.build.json) → exit 0
- `npm test` (backend) → 9 suites, 36 tests, exit 0
- activity-subgraph `typecheck` → exit 0
- Both Prisma clients regenerated offline (canonical 48 models, subgraph)

## Staged (gated) — not done here

Physical retirement of `services/workouts-service` gated on CI runtime
validation + infra rewire (G2/G3), same as auth/users/payments. Tracked as
**WORKOUT-RETIRE** in the retirement matrix.

## Technical-debt delta

- D2: `Workout ×3` fully resolved (canonical + rename); last multi-definition
  core model remaining is domain-by-domain (Meal/Notification/etc. per fold).
- D4: −16 `Promise<any>` (the workouts-service hotspot), −1 `as any`.
- New: **D17 TEST-ESTATE** — legacy `test/` scaffolds quarantined behind
  `test:legacy`, need repair or deletion in a dedicated pass.
