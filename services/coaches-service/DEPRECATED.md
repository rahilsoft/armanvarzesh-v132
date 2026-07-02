# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Profiles (Coach)** capability lives in the modular monolith at
`app/backend/src/coaches` (`CoachesModule`, wired in `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-PROFILES-MIGRATION.md`.

Folded: profile fields (`speciality`, `certifications`, `bio`, `verified`)
into the canonical `Coach` + typed CRUD with whitelisted writes and
`verify()`. The service's `password` column was NOT ported — coach
credentials belong to the canonical User auth. content-service Specialist*
models join at the content dismemberment phase. Migration:
`20260702000009_profiles_coach_fold/`. Retirement gated
(**COACHES-RETIRE**). Do not add features here.
