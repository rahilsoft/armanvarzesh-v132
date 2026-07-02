# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Workout** domain now lives in the modular monolith at
`app/backend/src/workouts` (`WorkoutsModule`, wired into `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md`.

## What was migrated (commit-verified)

- **Schema:** canonical `Workout` gained the structured session columns this
  service owned (`planId`, `date`, `duration`, `sets`, `reps`, `weight`, `rpe`,
  `notes`, `mediaUrl`); `WorkoutPlan` and `Exercise` models added (Int PKs,
  Cascade/SetNull FK semantics preserved). Real SQL migration:
  `app/backend/src/database/prisma/migrations/20260702000001_workout_domain_fold/`.
- **Logic:** plan/exercise CRUD, case-insensitive exercise search, and the
  progress aggregation (volume = sets × reps × weight, average RPE) ported to
  `WorkoutPlansService` — with this service's 16 `Promise<any>` signatures
  replaced by real types and its private `new PrismaClient()` replaced by the
  injected `PrismaService`.
- **GraphQL:** `WorkoutPlan`/`Exercise` entities, typed inputs, and
  `WorkoutPlansResolver` (plans/exercises/search/progress queries + CRUD
  mutations) exposed via the monolith GraphQL schema.
- **Fix:** the monolith previously stuffed structured workout fields into the
  `data` JSON blob (columns didn't exist); they now persist as real columns.
- Covered by `app/backend/src/workouts/__tests__/workout-plans.service.spec.ts`
  (9 tests, green).

The name-collision duplicate in `app/activity-subgraph` was renamed
`TrainingSession` (`@@map("Workout")` keeps its table) — it is Activity-domain
telemetry, not this entity.

## Why this service is not yet deleted

Retirement is gated on CI runtime validation (real Postgres) + infra rewire
(compose/k8s/prometheus references), same G1–G4 gates as auth/users/payments —
see `.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`. Do not add new
features here.
