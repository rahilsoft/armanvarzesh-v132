# ADR-B9 — Activity telemetry is a separate bounded context (TrainingSession, not Workout)

Status: **Accepted** · Date: 2026-07-02 · Relates to: ADR-B1 (hybrid topology),
`.reports/architecture/DOMAIN-OWNERSHIP.md`, `PHASE-4-WORKOUT-MIGRATION.md`

## Context

Until the Workout fold, three Prisma models named `Workout` existed:

1. `app/backend` (canonical core) — the training-session entity
   (plan link, sets/reps/weight/RPE, notes, media).
2. `services/workouts-service` — duplicate of (1); folded and deprecated.
3. `app/activity-subgraph` — **a different concept sharing only the name**:
   time-boxed training-load telemetry (`startedAt/endedAt`, `minutes`, `sRPE`,
   `avgHR`, `maxHR`, cuid string ids) consumed by the subgraph's
   `combinedLoad` resolvers to compute load trends.

## Decision

- The **canonical `Workout` entity belongs to the modular monolith core**
  (Int PKs, one canonical schema).
- The activity-subgraph model is renamed **`TrainingSession`** with
  `@@map("Workout")` so its existing table is untouched (zero-migration,
  zero-downtime rename at the model layer).
- `TrainingSession` is explicitly classified as a **cross-domain telemetry
  model** owned by the **Activity extension domain** (a KEEP microservice per
  the ownership map). It is *not* a duplicate of the canonical Workout and
  must not be "unified" with it.

## Boundary contract (enforced, not implied)

1. **No code imports across the boundary** in either direction
   (`app/backend` ↔ `app/activity-subgraph`). Verified at this commit: 0
   matches both ways; the unused `activity-subgraph/*` tsconfig path aliases
   in the backend were removed to close the escape hatch.
2. **No shared Prisma client**: each side generates its own client from its
   own schema (`output = "./generated/client"` + per-project path mapping).
3. **Correlation is by `userId` value only** — no foreign keys across the
   boundary, no shared tables. The physical table name overlap
   (`"Workout"` via `@@map`) is a legacy artifact of separate databases; the
   two deployments do not share a database schema.
4. If the core ever needs load-telemetry data, it consumes the Activity
   subgraph's **GraphQL API** (federation), never its tables.

## Consequences

- The name collision that made `Workout` appear "defined 3×" (D2) is fully
  resolved without destroying Activity-domain data or deployments.
- A future physical table rename (`Workout` → `TrainingSession` in the
  subgraph DB) is optional and purely cosmetic; if done, it is a
  one-statement migration plus dropping the `@@map`.
