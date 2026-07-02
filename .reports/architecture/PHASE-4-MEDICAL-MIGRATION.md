# Phase 4 — Medical domain: migration report

Branch `claude/project-completion-phase-next`. Canonical: **modular monolith,
Int PKs**, new `app/backend/src/medical` module (extractable seam:
exports + `/medical` REST only).

## Artifact classification (medical-service)

| Artifact | Class | Action |
|---|---|---|
| Facility/Doctor/HealthTest/TestBundle/TestBundleOnTest/Appointment/Result | Canonical (unique) | **Folded** (String ids → Int PKs; FK to User) |
| `Slot` (clinical) | Canonical, name-collision | **Renamed `ClinicSlot`** — separate bounded context from the coach-booking `Slot` |
| catalog/booking/fasting/ICS/cancel/reschedule/summary/results-webhook logic | Canonical (unique) | **Ported** typed to `MedicalService` |
| service bootstrap | Legacy infra | Retired with the service |

## Key changes

- Canonical schema **63 → 71 models**; migration
  `20260702000005_medical_domain_fold/migration.sql` (128 lines,
  `prisma migrate diff` from the saved pre-fold schema).
- Port quality: injected `PrismaService` (another rogue `new PrismaClient()`
  removed); `uid()` pseudo-uuid gone (autoincrement ids; ICS UID derived from
  the appointment id); results-ready webhook validates the appointment
  (unknown id was an unhandled Prisma crash) and emits
  `MEDICAL_RESULTS_READY` to the outbox; fasting-upcoming query filters in
  the database instead of in JS.
- Same `/medical/*` REST routes; `GET /medical/summary` exposes the summary
  method that previously had no route.

## Verification (this commit)

- `npm run typecheck` → exit 0 (client regenerated, 71 models)
- `npm run lint` → exit 0
- `npm test` → 24 suites / 81 tests green (5 new)

## Staged (gated)

**MEDICAL-RETIRE** after CI runtime validation + infra rewire.

## Technical-debt delta

- Closed: second `Slot` name collision (ClinicSlot), one more rogue
  PrismaClient, unguarded webhook update, silent TODO-notify.
- Physio (physio-service + subgraph + content-service Corrective*) is the
  next clinical fold — kept separate per one-domain-per-commit.
