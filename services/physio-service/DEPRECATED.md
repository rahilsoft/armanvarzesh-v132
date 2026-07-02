# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Physio** domain lives in the modular monolith at
`app/backend/src/physio` (`PhysioModule`, wired in `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md` and
`.reports/architecture/PHASE-4-PHYSIO-MIGRATION.md`.

Folded: PhysioProtocol/PhysioStep/PhysioAssignment/PhysioSession/PainLog/
RomMeasure (String ids → Int PKs, FKs to User; `@@unique([assignmentId,date])`
added), full service logic (assignment with archive, today plan, owner-only
session completion, VAS pain logging with 2h rate limit, ROM tracking,
progress, protocol seeding). Migration:
`20260702000006_physio_domain_fold/`. Tests:
`app/backend/src/physio/__tests__/physio.service.spec.ts` (5, green).

content-service `Corrective*` models join at the content dismemberment phase;
`app/physio-subgraph` is reviewed there too.

Retirement gated on CI runtime validation + infra rewire (**PHYSIO-RETIRE**).
Do not add new features here.
