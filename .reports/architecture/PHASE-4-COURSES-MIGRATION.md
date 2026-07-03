# Phase 4 — Courses/LMS domain: migration report

Canonical: **modular monolith, Int PKs**, new `app/backend/src/courses` module.
Two services folded in one domain cycle (both Courses/LMS per ownership map).

## Classification
| Source | Artifact | Class | Action |
|---|---|---|---|
| courses-service | CourseAsset (encrypted chunks), Certificate (code/qrToken) schema | Canonical (unique) | Folded; canonical `Course` extended (summary/difficulty/relations) |
| courses-service | `CoursesService` logic | **Stub** (in-memory; never touched its own Prisma models) | Re-implemented DB-backed (CRUD, idempotent enroll, ordered assets) |
| courses-service | in-memory `Session` concept | Dead (never persisted, no consumers) | Not ported |
| certificate-service | JWT+QR issue/verify | Canonical (unique) | Ported into `CoursesService` (issue/verify/revoke) |
| certificate-service | Certificate model (kind/payload/revoked, cuid) | Overlap | **Merged** with courses-service shape into one canonical `Certificate` |

## Key changes
- Schema **77 → 80 models** (`CourseAsset`, `CourseEnrollment`, merged
  `Certificate`; `Course` extended in place); migration `20260702000007`
  (68 lines).
- Certificates: issue requires enrollment; **verify now checks revocation**
  (original checked only the JWT signature — revoked certificates verified
  as valid); `CERT_SECRET` fail-fast in production (original silently signed
  with 'change_me'); revoke endpoint added.
- `qrcode` + `@types/qrcode` declared (were resolve-by-accident, D11 pattern).

## Verification
typecheck exit 0 · lint exit 0 · npm test 26 suites / 89 tests green (3 new).

## Staged
**COURSES-RETIRE** ×2 services (CI G2 + infra G3 gates).
