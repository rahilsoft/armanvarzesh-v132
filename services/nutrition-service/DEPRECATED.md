# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Nutrition** domain lives in the modular monolith at
`app/backend/src/nutrition` (`NutritionModule`, wired in `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md`.

## What was migrated (commit-verified)

- **Schema:** `NutritionGoal`, `HydrationLog`, `Habit`, `HabitLog` +
  `HabitType` enum folded into the canonical schema (Int PKs preserved) —
  now with real FKs to the canonical `User`, which this standalone service
  could not have. Migration:
  `app/backend/src/database/prisma/migrations/20260702000002_nutrition_domain_fold/`.
- **Logic:** goal upsert/get (`NutritionGoalsService`), hydration logging +
  range totals (`HydrationService`), habit create/log/today-progress
  (`HabitsService`, with the original per-habit N+1 query loop collapsed to
  one query), wearable ingest mapping water/steps → habits
  (`WearablesController`, class-validator instead of the zod pipe imported
  from the undeclared `@arman/shared`).
- Covered by `app/backend/src/nutrition/__tests__/nutrition-tracking.spec.ts`
  (5 tests, green).

## Route mapping (old → canonical)

| nutrition-service | monolith |
|---|---|
| `POST /v1/health/hydration` | `POST /nutrition/hydration` |
| `GET /v1/health/hydration?from&to` | `GET /nutrition/hydration/:userId?from&to` |
| `POST /v1/habits` | `POST /nutrition/habits` |
| `POST /v1/habits/:id/log` | `POST /nutrition/habits/:id/log` |
| `GET /v1/habits/today` | `GET /nutrition/habits/today/:userId` |
| GraphQL `nutritionGoal` / goal upsert | `GET /nutrition/goal/:userId` / `PUT /nutrition/goal` |
| `POST /v1/wearables/ingest` | `POST /v1/wearables/ingest` (unchanged) |

## Not migrated (Duplicate — monolith already canonical)

FoodItem/Meal CRUD, barcode lookup and food search: the monolith's
`Food`/`Meal`/`MealLog` surface (`FoodController`, `NutritionService`)
already owns these. `FoodItem` is retired with this service.

## Why this service is not yet deleted

Retirement gated on CI runtime validation (real Postgres) + infra rewire —
same G1–G4 gates as auth/users/payments/workouts
(`.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`); the gateway
composes a `nutrition` subgraph (`NUTRITION_URL`) that must be repointed
before deletion. Do not add new features here.
