# Phase 4 — Physio domain: migration report

Canonical: **modular monolith, Int PKs**, new `app/backend/src/physio` module.

## Classification (physio-service)
| Artifact | Class | Action |
|---|---|---|
| 6 models (Protocol/Step/Assignment/Session/PainLog/RomMeasure) | Canonical (unique) | Folded (Int PKs, FKs to User, `@@unique([assignmentId,date])`, indexes) |
| assignment/plan/session/VAS/ROM/progress/seed logic | Canonical (unique) | Ported typed to `PhysioService` |
| service bootstrap | Legacy infra | Retired with service |

## Key changes
- Schema **71 → 77 models**; migration `20260702000006` (100 lines).
- Port quality: injected PrismaService (rogue `new PrismaClient()` removed);
  the original's duplicated owner-check blocks collapsed into one
  `ownedSession` guard; `assignProtocol` validates the protocol id (original
  created dangling assignments); progress() pain query is one
  relation-filtered query instead of two id-collection round trips; seeding
  no longer requires caller-supplied ids.
- Deferred: content-service `Corrective*` + `app/physio-subgraph` → content
  dismemberment phase.

## Verification
typecheck exit 0 · lint exit 0 · npm test 25 suites / 86 tests green (5 new).

## Staged
**PHYSIO-RETIRE** (CI G2 + infra G3 gates).
