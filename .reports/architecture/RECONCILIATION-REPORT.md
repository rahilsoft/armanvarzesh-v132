# Repository Reconciliation Report

Branch `claude/project-completion-phase-next` · 2026-07-02 · performed after
the branch replay and the Nutrition fold, before the Booking fold.
Method: **86 mechanical checks** against the working tree + git history (no
reports or memory trusted); commit-presence scan; migration-chain replay
verification using schemas taken **from git history**, not local files.

## Verified — 84/86 checks passed, plus:

| Area | Evidence |
|---|---|
| **All 9 program commits present** on this branch (Foundation, Ownership map, Phase-1 cleanup, Auth, Users, Payments, v0.3 baseline, Workout, Stability, Nutrition) | commit-message scan of `git log` |
| **Foundation** (5 checks) | inventory TSVs, Stage-1 architecture + debt reports, ownership map |
| **Phase 1 cleanup** (6) | the 4 deleted components are absent from tree *and* lockfile |
| **Auth fold** (14) | ported service/controller/module/DTOs, 4 schema models + `passwordHash`, app.module wiring, dead controller absent, tests, DEPRECATED, report, offline-prisma helper, tsconfig client mapping |
| **Users fold** (7) | profile columns, `pickUserFields`, entity fields, cast removed, tests, DEPRECATED, report |
| **Payments fold** (9) | 5 models + `Subscription` extension + `providerSessionId` extref, `CheckoutService` + module registration, tests, DEPRECATED, report, ConflictException-rethrow fix |
| **v0.3 baseline** (9) | all 9 baseline documents |
| **Workout fold** (14) | structured columns, `WorkoutPlan`/`Exercise`, 3 migration files, services/resolvers/entities/DTOs, app.module wiring, JSON-stuffing fix, subgraph `TrainingSession` rename + code refs, tests, DEPRECATED, report |
| **Stability** (12 of 14) | eslint config, test/README, unit/e2e/legacy layers populated, placeholders gone, supertest declared, ADR-B9, boundary aliases removed, media fixes, 4 BOOKING-DRIFT markers, report |
| **Nutrition fold** (8) | 4 models + enum, migration, 3 services + 2 controllers, module registration, tests, DEPRECATED, report |
| **Migration chain integrity** | `0_init` regenerated from the **git-history** pre-Workout schema → byte-identical to committed file; nutrition delta regenerated from `1b8a0a1^` schema → byte-identical. The migrations replay to the current 52-model schema. |
| **Tests executable** | `npm test` this session: 21 suites / 62 passing (Auth 7, Users 3, Payments 6+3, Workout 9, Nutrition 5 + repaired/unit estate) |
| **Nothing lost in the branch replay** | replayed tree was verified byte-identical to the old tip at replay time; all subsequent checks above ran on the new branch |

## Missing — 3 items found, all fixed in this commit

| Item | Cause | Fix |
|---|---|---|
| `test/integration/` layer absent | created as an empty dir pre-replay; git does not track empty dirs, so it vanished in the stash/replay | recreated with a charter README (layer contract + why it is empty until the CI G2 workstream) |
| `app/backend/e2e/jest.e2e.config.ts` leftover | dead config pointing at the removed `e2e/` root; superseded by the `test:e2e` script | deleted |
| `BASELINE-v0.3/README.md` rollback SHA pointed at `5755c9f` — a commit that exists **only on the old branch** | branch replay rewrote SHAs | updated to `7c9f0f8` (the replayed baseline commit); local tag retargeted |

## Recreated items
Only the `test/integration/` charter (above). No source, schema, migration,
or test content was lost — every implementation claim traced to real files.

## Remaining technical debt (open register)

- **D3/D13 + \*-RETIRE:** dev compose/k8s/gateway still route to the 5
  DEPRECATED services (auth, users, payments, workouts, nutrition); deletion
  gated on CI runtime validation (G2) + infra rewire (G3).
- **BOOKING-DRIFT:** 4 `@ts-expect-error` markers in `reservation.service.ts`
  — erased by the next fold (Booking).
- **D11:** `app/backend` declares none of its 8 `@arman/*` imports.
- **D12 PAYMENTS-WIRE:** `PaymentsModule` still not wired into `app.module`.
- **D17 TEST-ESTATE:** `test/legacy/` quarantine awaiting repair/deletion.
- **D14–D16**, content-service dismemberment (48 models), remaining `as any`
  mass (concentrated in content-service), lint estates of other workspaces
  (only `app/backend` is lint-zero so far).

## Current roadmap position

Foundation ✅ → Ownership map ✅ → Phase-1 cleanup ✅ → Auth ✅ → Users ✅ →
Payments ✅ → v0.3 baseline ✅ → Workout ✅ → Stability ✅ → Nutrition ✅ →
**Reconciliation ✅ (this commit)** → **next: Booking** → Gamification →
Medical/Physio → content-service dismemberment → \*-RETIRE wave (CI-gated).
