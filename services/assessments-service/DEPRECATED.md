# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Assessments** domain lives in the modular monolith at
`app/backend/src/assessments` (`AssessmentsModule`, wired in `app.module`),
per `.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-ASSESSMENTS-MIGRATION.md`.

Folded: Assessment/Section/Question/AssessmentAttempt (String ids → Int PKs,
FK to User) + the JSON scoring rule engine (map/range/boolean × weight),
answer validation, recommendation thresholds, and a real `myAttempts`
implementation (the service's `myAssessments` ignored the user and returned
everything). Migration: `20260702000008_assessments_domain_fold/`. Tests:
3, green. Retirement gated (**ASSESSMENTS-RETIRE**). Do not add features here.
