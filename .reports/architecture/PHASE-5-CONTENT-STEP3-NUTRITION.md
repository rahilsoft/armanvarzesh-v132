# Content dismemberment step 3 — Nutrition planning → Nutrition module

## Folded (cuid → Int PKs)
- `NutritionTemplate`, `NutritionPlan` (unique) — new canonical models.
- content `Food` **merged** into canonical `Food` (+nameFa/nameEn/unitsJson/
  createdBy; canonical title/barcode kept).
- content `MealLog` was a **different concept** than the canonical MealLog
  (plan-meal check log vs food-quantity log) → renamed
  `NutritionPlanMealLog` with `@@unique([planId,dayIndex,mealKey])`
  (same pattern as TrainingSession/ClinicSlot).
- Schema **98 → 101 models**; migration `20260702000013` (66 lines).

## Code
`NutritionPlanGeneratorService`: Mifflin-St Jeor TDEE + goal adjustment +
macro split (ported verbatim, typed), unit→grams conversion, per-item macro
computation, template expansion across weeks with day/plan totals, active
plan lookup, meal check as **idempotent upsert with ownership guard** (the
original create()d unconditionally — duplicate check rows per meal — and
never verified the plan belonged to the caller).

## Verification
typecheck exit 0 · lint exit 0 · npm test 32 suites / 106 tests green (3 new).
