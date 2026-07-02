# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Medical** domain lives in the modular monolith at
`app/backend/src/medical` (`MedicalModule`, wired in `app.module`), per
`.reports/architecture/DOMAIN-OWNERSHIP.md`.

## What was migrated (commit-verified)

- **Schema:** Facility, Doctor, HealthTest, TestBundle, TestBundleOnTest,
  Appointment, Result folded with core **Int** PKs and an FK
  `Appointment.userId → User`. This service's `Slot` became **`ClinicSlot`**:
  clinical scheduling is a separate bounded context from the coach-booking
  `Slot` (same rationale as ADR-B9). Migration:
  `app/backend/src/database/prisma/migrations/20260702000005_medical_domain_fold/`.
- **Logic:** `MedicalService` — test catalog + bundles, nearby facilities,
  capacity-checked appointment booking with fasting detection and ICS
  calendar output, owner-only cancel (idempotent) / reschedule, medical
  summary, and the lab results-ready webhook (now also emits a
  `MEDICAL_RESULTS_READY` outbox event — the original had a TODO to notify,
  and its unguarded `appointment.update` would crash on an unknown id, now a
  clean 400).
- **REST:** same `/medical/*` routes (ids now Int; `GET /medical/summary`
  added for the summary that had no route).
- Covered by `app/backend/src/medical/__tests__/medical.service.spec.ts`
  (5 tests, green).

## Why this service is not yet deleted

Retirement gated on CI runtime validation + infra rewire — G1–G4 in
`.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`
(**MEDICAL-RETIRE**). Do not add new features here.
