# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Courses/LMS** domain lives in the modular monolith at
`app/backend/src/courses` (`CoursesModule`, wired in `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-COURSES-MIGRATION.md` (artifact
classification + details).

Retirement gated on CI runtime validation + infra rewire (**COURSES-RETIRE**).
Do not add new features here.
