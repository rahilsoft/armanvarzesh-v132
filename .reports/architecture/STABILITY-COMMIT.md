# Architecture Stability Commit — report

Branch `claude/project-completion-phase-next` (created from `origin/main` at
`1de706c` after PR #42 merged; the 11 unmerged consolidation commits were
replayed onto it — final tree verified identical to the old tip).

Scope per owner instruction: repo-wide stabilization before the Nutrition fold.

## 1. Lint — backend fully clean (was: eslint could not start)

- **Infra:** root `eslint.config.js` imported the never-installed
  `typescript-eslint` wrapper and used `__dirname` in ESM → eslint crashed on
  startup everywhere. Rewritten against the installed `@typescript-eslint` v7
  plugin/parser (previous commit) — this commit finishes the estate.
- **98 findings → 0** (`npx eslint .` exit 0 in `app/backend`):
  - 75 unused imports/vars removed (script-driven from eslint JSON, position-based).
  - 11 `no-var-requires`: 3 converted to real imports (`stripe-webhook.ts`
    express, e2e spec body-parser, media.service bullmq); 8 **explicitly
    suppressed with justification** (OpenTelemetry optional-deps in
    `tracing.ts`, optional Prisma fallback in `idempotency.service.ts`, probe
    in `seed.ts`, lazy Redis adapter in `live.gateway.ts`).
  - 9 `@ts-ignore`: 4 were dead (removed — tsc proved the next lines
    error-free); 1 masked a missing import (`live.gateway.ts` used
    `createAdapter` **with no import — that code path could never have
    worked**; now a justified lazy require); 4 masked **real Booking-domain
    schema drift** in `reservation.service.ts` (`Slot` model and `id_version`
    key don't exist in the canonical schema) — converted to `@ts-expect-error`
    with justification referencing the pending Booking fold.
  - 1 `no-unreachable`: real bug in `media.service.ts` — the image path
    returned unconditionally, so **every video was enqueued as a resize job**;
    branch fixed. Also fixed its load-time crash (`mediaJobs` used
    `prom-client` before the import statement).

## 2. Test structure — normalized to four explicit layers

See `app/backend/test/README.md`. Physical moves (git mv, history preserved):

- **Deleted 8 fake-green placeholders** (`expect(true)`-only "e2e" suites +
  a `describe.skip` skeleton). They squatted on `.spec.ts` names while the
  6 real e2e suites — named `*.e2e-spec.ts` — were invisible to jest's
  `testMatch`. Real suites renamed to `.e2e.spec.ts` and now actually run.
- Root `e2e/` (real supertest suites + `utils/test-app.ts`) → `test/e2e/`.
- 13 unit-level suites (root strays + `test/*.spec.ts`) → `test/unit/`.
- 9 broken scaffolds (old constructors/removed controllers/vitest suite)
  → `test/legacy/` (quarantine, D17).
- `supertest` + `@types/supertest` **declared** in devDependencies (they were
  resolved-by-accident/unresolvable before — the D11 pattern).
- Scripts: `test` = `jest src test/unit` (required gate) ·
  `test:integration` · `test:e2e` · `test:legacy` · `test:all`.
- Gate result: **20 suites / 57 tests passing** (2 contract suites self-skip),
  up from 36 tests before normalization.

## 3. Semantic boundary made explicit (no implicit rename)

`docs/adr/ADR-B9-activity-telemetry-boundary.md`: `TrainingSession`
(activity-subgraph) is a **cross-domain telemetry model** in the Activity
bounded context — not the canonical `Workout`. Contract: no cross-imports, no
shared client, correlation by `userId` value only, cross-context reads go via
the federation API.

## 4. Domain-leakage audit — clean, one hole closed

- `app/backend` ↔ `app/activity-subgraph` imports: **0 in both directions**.
- Backend does not touch the subgraph's Prisma client: **0 references**.
- Closed: backend tsconfigs carried unused `activity-subgraph/*` path aliases —
  an escape hatch for silent leakage. Removed from `tsconfig.json` and
  `tsconfig.build.json`; typecheck stays green.

## 5. No hidden schema divergence — verified mechanically

- `prisma validate`: canonical schema ✓, subgraph schema ✓.
- `prisma migrate diff` (pre-Workout schema → current) regenerated and
  compared byte-for-byte with the committed
  `20260702000001_workout_domain_fold/migration.sql`: **exact match**.
- Remaining known drift is *explicit*, not hidden: reservation.service's
  Booking-domain `@ts-expect-error` markers (§1) and the DEPRECATED service
  schemas registered in `BASELINE-v0.3/ERD.md`.

## Verification (this commit)

| Gate | Result |
|---|---|
| `npm run typecheck` (backend) | exit 0 |
| `npm run lint` → `eslint .` (backend) | exit 0, 0 problems |
| `npm test` (unit gate) | 20 suites / 57 tests, exit 0 |

## Debt delta

- **Closed:** Task#2/lint-estate (backend), D17 partially structured
  (quarantine + README), leakage hole (tsconfig aliases).
- **Opened (explicit):** BOOKING-DRIFT — 4 `@ts-expect-error` sites in
  `reservation.service.ts` to be removed by the Booking fold.
