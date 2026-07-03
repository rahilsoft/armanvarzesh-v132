# Content dismemberment step 1 — Exercise catalog → Workout module

Per the committed ownership matrix (`CONTENT-SERVICE-OWNERSHIP-MATRIX.md`).

## Folded (5 models + enum, cuid → Int PKs)
ExerciseVideo (+ moderation status/view/like counters), Sport,
EquipmentCatalog, MuscleRef (`@@map("Muscle")` — name kept clear of the
legacy schema while it exists), AnatomyConfig (3D mesh map), ExerciseStatus
enum. Schema **84 → 89 models**; migration `20260702000011` (155 lines,
M2M join tables included).

## Code
`ExerciseCatalogService` in the Workout module (create with taxonomy
connects, moderation gate — search returns APPROVED only unless
`includePending`, muscle/level/kind filters, view counter, muscle upsert,
sport/equipment create, single-active-per-gender anatomy config).

## Infra fix
jest now maps `@prisma/client` to the canonical generated client
(moduleNameMapper) — it silently resolved a sibling service's client; all
prior tests used types only (erased), this fold's `ExerciseStatus` is the
first runtime enum value.

## Verification
typecheck exit 0 · lint exit 0 · npm test 30 suites / 98 tests green (2 new).

## Next dismemberment steps (order per matrix)
Plan* engine (9 models) → Workout; Nutrition merges; Specialist* → Profiles;
CMS group; Corrective* → Physio; extension handoffs; retire content-service.
