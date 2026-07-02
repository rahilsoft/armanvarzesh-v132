# Content dismemberment step 4 — Specialist* → Profiles

## Folded (cuid → Int PKs)
- `SpecialistProfile` + `SpecialistMeta` **merged into canonical `Specialist`**
  (+displayName/avatarUrl/tags/genderFocus/minAge/maxAge/languages/
  thumbnailUrl/activeAt; canonical bio/videoUrl kept — `introVideoUrl` maps
  to existing `videoUrl`).
- `SpecialistScore`, `SpecialistScoreHistory`, `ScoringWeights` → new
  canonical models keyed on `SpecialistType` (enum extended additively with
  PHYSICAL_THERAPIST/PSYCHOLOGIST/SPECIALIST from content's ServiceType).
- `SpecialistScore` upsert key fixed: the original upserted on
  `{ specialistId }` cast `as any` against a `@@unique([specialistId, role])`
  — an invalid where that only worked by accident; now the real compound key.
- Schema **101 → 104 models**; migration `20260702000014` (70 lines).

## Code
`SpecialistScoringService` (Profiles/coaches module): the 9 metric
normalisation formulas + newcomer baseline boost + weighted total ported
verbatim as pure functions (fully unit-tested against hand-computed values);
per-role weights CRUD; compute→upsert+history; topByRole; recomputeAll.
Raw activity counts are supplied via the injectable
`SpecialistMetricSources` — chat/CRM/survey/video sources belong to other
bounded contexts (ADR-B9) and plug in as their folds land; the default
implementation reads what the canonical schema owns today (plans authored).

## Verification
typecheck exit 0 · lint exit 0 · npm test 33 suites / 110 tests green (4 new).
