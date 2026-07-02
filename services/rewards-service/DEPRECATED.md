# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Gamification** domain lives in the modular monolith at
`app/backend/src/gamification` (`GamificationModule`, wired in
`app.module`), per `.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-GAMIFICATION-MIGRATION.md` (which carries the
per-service artifact classification and route mapping).

Retirement is gated on CI runtime validation + infra rewire (G1–G4 in
`.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`, item
**GAMIFICATION-RETIRE**). Do not add new features here.
