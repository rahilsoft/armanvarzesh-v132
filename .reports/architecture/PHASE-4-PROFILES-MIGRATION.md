# Phase 4 — Profiles (Coach) domain: migration report

Canonical: **modular monolith, Int PKs** (`app/backend/src/coaches`, now
wired — it was another unwired dead module).

## Classification (coaches-service)
| Artifact | Class | Action |
|---|---|---|
| Coach profile fields (speciality/certifications/bio/verified) | Canonical (unique) | Folded into canonical `Coach` (extended in place) |
| CRUD + `verify()` | Overlap + unique | Monolith service typed (`CoachWriteInput` + whitelist, all `any`s removed); `verify()` + verified-only listing ported |
| `password` column | Superseded | Not ported — credentials belong to canonical User auth |
| service bootstrap | Legacy infra | Retired with service |

## Key changes
- Schema: `Coach` +4 columns (migration `20260702000009`, 4 ALTERs).
- Monolith coaches module **was not wired into app.module** (dead) — now live.
- Entity exposes new nullable fields; controller null-safety fixed.
- Deferred: `Specialist*` (content-service) → content dismemberment phase.

## Verification
typecheck exit 0 · lint exit 0 · npm test 28 suites / 94 tests green (2 new).

## Staged
**COACHES-RETIRE** (CI G2 + infra G3; gateway composes a `coaches` subgraph —
repoint before deletion).
