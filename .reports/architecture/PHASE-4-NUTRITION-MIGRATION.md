# Phase 4 — Nutrition domain: migration report

Branch `claude/project-completion-phase-next`. Canonical: **modular monolith,
Int PKs** (`app/backend/src/nutrition`, already wired in `app.module`).

## Artifact classification (nutrition-service)

| Artifact | Class | Action |
|---|---|---|
| `NutritionGoal` model + setGoal/getGoal | Canonical (unique) | **Folded** — schema + `NutritionGoalsService` |
| `HydrationLog` model + create/getRange | Canonical (unique) | **Folded** — schema + `HydrationService` |
| `Habit`/`HabitLog`/`HabitType` + create/log/getToday | Canonical (unique) | **Folded** — schema + `HabitsService` |
| Wearables ingest (water/steps → habits) | Canonical (unique) | **Folded** — `WearablesController` |
| `FoodItem`/`Meal` CRUD, barcode, search | Duplicate | Monolith `Food`/`Meal`/`MealLog` surface kept; `FoodItem` retired |
| service bootstrap (main/tracing/metrics/health) | Legacy infra | Retired with the service |

## Schema & migration (real files)

- Canonical schema: **48 → 52 models** (+ `HabitType` enum); the folded models
  gained proper FKs to `User` (`onDelete: Cascade`) — impossible in the
  standalone service's isolated database. User relations added
  (`nutritionGoal`, `hydrationLogs`, `habits`).
- Migration `20260702000002_nutrition_domain_fold/migration.sql` (90 lines:
  CreateEnum + 4 CreateTable + indexes + FKs), generated with
  `prisma migrate diff` from the saved pre-fold schema.

## Port quality changes (behaviour-preserving unless noted)

- Injected `PrismaService` replaces two private `new PrismaClient()`
  instances (each was a separate connection pool outside Nest lifecycle).
- `HabitsService.getToday` N+1 fixed: one `habitLog.findMany` with
  `habitId IN (...)` grouped in memory (was a query per habit).
- `logHabit` now 404s on a missing habit instead of throwing a raw Prisma FK
  error.
- Wearables ingest: zod pipe from the **undeclared** `@arman/shared` (D11
  pattern) replaced with class-validator (monolith standard); unmissing
  `userId` now returns a clean failure instead of NaN queries; heartRate/
  calories datapoints documented as Activity-domain telemetry (ADR-B9), not
  silently dropped.
- REST route table old → new recorded in the service's `DEPRECATED.md`.

## Verification (this commit)

- `npm run typecheck` → exit 0 (regenerated canonical client, 52 models)
- `npm run lint` → exit 0
- `npm test` → 21 suites / 62 tests green (5 new nutrition tests)

## Staged (gated) — not done here

Physical retirement of `services/nutrition-service` gated on CI runtime
validation + gateway rewire (`NUTRITION_URL` subgraph). Tracked as
**NUTRITION-RETIRE** in the retirement matrix.

## Technical-debt delta

- D2: nutrition-service's 6-model schema superseded; `Meal` dup resolved
  (canonical `Meal` kept; service copy retired with the service).
- Removed 2 more rogue `PrismaClient` instances.
- Remaining Nutrition overlap: `content-service` Food/NutritionTemplate/
  NutritionPlan/MealLog — handled by the content-service dismemberment phase
  (ownership matrix process, per owner instruction).
