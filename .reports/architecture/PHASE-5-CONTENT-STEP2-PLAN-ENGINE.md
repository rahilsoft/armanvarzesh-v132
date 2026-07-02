# Content dismemberment step 2 — Plan* engine → Workout module

## Folded (9 models + 3 enums, cuid → Int PKs)
Plan/PlanDay/PlanBlock/PlanBlockItem/PlanSet/PlanAssignment/PlanSession/
PlanSessionNote/PlanSetLog + PlanKind/BlockType/SessionStatus. Schema
**89 → 98 models**; migration `20260702000012` (210 lines). PlanBlockItem
FK → the step-1 canonical ExerciseVideo.

## Code
`PlanEngineService`: nested plan creation with protocol validation
(5X5/GVT/EMOM/HIIT — ported verbatim), publish with version bump, assignment
with the week-keyed schedule generator (rest days, weekly cap, plan-day
cycling), re-anchoring, session completion (idempotent), set logging with
FK validation, notes, sessions-by-client, adherence.

## Defects fixed (regression-tested)
1. Generated sessions now carry `clientId` — the original created them
   without it, so adherence-by-client always returned 0 scheduled.
2. Schedule computed in memory + one `createMany` (original did a
   count+create query pair per calendar day — ~56 queries per assignment).
3. `assignPlan` validates plan existence/non-emptiness (original crashed on
   `plan?.days.length||1` fallback into modulo-by-1 misindexing).

## Verification
typecheck exit 0 · lint exit 0 · npm test 31 suites / 103 tests green (5 new).

## Dropped (classified, not lost)
The resolver's S3 multipart-upload mutations belong to the **Media extension
service** (matrix: MediaJob → media); GraphQL DTO layer is superseded by the
monolith's typed service API (REST/GraphQL exposure can be added at the
gateway consolidation step without logic changes).
