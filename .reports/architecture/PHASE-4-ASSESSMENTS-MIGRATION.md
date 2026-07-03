# Phase 4 — Assessments domain: migration report

Canonical: **modular monolith, Int PKs**, new `app/backend/src/assessments`.

## Classification (assessments-service)
| Artifact | Class | Action |
|---|---|---|
| Assessment/Section/Question/AssessmentAttempt models | Canonical (unique) | Folded (Int PKs, FK User, ordering/index) |
| JSON scoring rule engine + submit/validate/clamp/recommend | Canonical (unique) | Ported typed (`ScoringRule` replaces `any`) |
| `myAssessments(userId)` | Defective (ignored the user, returned all assessments) | Re-implemented as `myAttempts` (real per-user history) |
| `startAssessment` | Alias of `getAssessment` | Collapsed |
| service bootstrap | Legacy infra | Retired with service |

## Key changes
- Schema **80 → 84 models**; migration `20260702000008` (72 lines).
- Injected PrismaService (another rogue `new PrismaClient()` removed);
  seeding no longer requires caller-supplied ids; sections returned ordered.
- Canonical `Survey` (older simple Q&A model) untouched — different concept.

## Verification
typecheck exit 0 · lint exit 0 · npm test 27 suites / 92 tests green (3 new).

## Staged
**ASSESSMENTS-RETIRE** (CI G2 + infra G3 gates).
