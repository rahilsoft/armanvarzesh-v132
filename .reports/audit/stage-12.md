# Stage 12 — Testing Audit

**Source of truth:** repository only.

---

## Inventory (verified)
- Test files total: **503** (`*.spec.ts`/`*.test.ts`/`*.e2e-spec.ts`/`.tsx`).
- Under app/service/package trees: **214** `.spec.ts` + **71** `.e2e-spec.ts`.
- Skipped/`xit`/`it.todo`/`describe.skip`: **89** occurrences.
- Trivial/placeholder assertions: many files with `expect(true).toBe(true)`.
- Coverage thresholds configured: `jest.preset.base.ts` → lines 70 / statements 70 / branches 60 / functions 65; `jest.config.ts` → branches 50.

---

## Findings

### P1-01 — Fake/placeholder tests inflate the count and defeat coverage gates
**Evidence:**
- `services/ai-service/test/smoke.test.ts` — the entire test is `expect(true).toBe(true)`.
- `services/ai-service/test/health.spec.ts` — `test('health',()=>expect(true).toBe(true));`.
- Same trivial pattern in `services/courses-service`, `services/users-service`, `services/coaches-service` (`test/health.spec.ts`, `test/smoke.test.ts`), `services/analytics-collector/src/__tests__/smoke.spec.ts`, and more.
- Root `package.json` `test:e2e` script → `echo "e2e placeholder"`.
**Why it is a problem:** These assert nothing. They exist to make the suite "pass" and to satisfy `--passWithNoTests`. Real coverage of these services is effectively zero despite green CI. The configured 70% thresholds are meaningless if suites are trivial or skipped.
**Production impact:** False confidence; untested code ships. Directly contradicts any "tested and ready" claim.
**Recommended fix:** Delete placeholder tests; require meaningful assertions; enforce coverage on real code paths (exclude nothing critical).
**Effort:** L. **Risk:** High.

### P1-02 — 89 skipped/disabled tests
**Evidence:** 89 `\.skip(`/`xit(`/`xdescribe(`/`it.todo` across the repo.
**Why it is a problem:** Disabled tests are silent coverage holes; frequently disabled because they broke and were never fixed.
**Production impact:** Regressions in the skipped areas go undetected.
**Recommended fix:** Fix or delete; forbid `.skip` in CI via lint rule.
**Effort:** M. **Risk:** Medium.

### P2-03 — E2E is a placeholder at the root; contract tests unverifiable
**Evidence:** `package.json` `test:e2e` → `echo "e2e placeholder"`; `test:e2e:flow` → prints a console message. There are `packages/contracts-tests/` and `tests/` dirs (62 subdirs) but the root E2E entrypoint is a stub. Per prior commit `145ef28` the E2E suite was made to "compile and run", but the root script still stubs it.
**Why it is a problem:** No verifiable end-to-end gate from the repo's canonical script.
**Production impact:** Integration regressions uncaught.
**Recommended fix:** Wire a real Jest/Playwright E2E config into `test:e2e`.
**Effort:** M. **Risk:** Medium.

### P2-04 — Two conflicting coverage thresholds
**Evidence:** `jest.preset.base.ts` (branches 60) vs `jest.config.ts` (branches 50). With multiple Jest configs (Stage 01 P2-03) it's unclear which enforces.
**Why it is a problem:** Ambiguous quality gate.
**Recommended fix:** One authoritative Jest config + thresholds.
**Effort:** S. **Risk:** Low.

---

## Positives (verified)
- Real, substantive tests exist for the hardened path: `app/backend/src/auth/__tests__/user-auth.service.spec.ts`, `services/auth-service/tests/e2e/auth.flow.e2e-spec.ts`, `apps/web-site/__tests__/ErrorBoundary.spec.tsx`.
- Contract-test package (`packages/contracts-tests`) with snapshots exists.
- Coverage thresholds are configured (even if bypassable).

## Stage score: **38/100** (Testing)
High file count masks pervasive placeholder/skip tests; real coverage is concentrated in a few modules.
