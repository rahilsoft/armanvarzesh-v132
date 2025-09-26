# Phase 4 — Resilience & Testing Baseline
Date: 2025-08-18

Applied:
- New package **@arman/http-client** (Axios wrapper with timeout/retry).
- Root ESLint rules: disallow `console.log`, block direct `axios` imports.
- Jest baseline (root + backend smoke test).
- CI workflow `ci-tests.yml` (Node 20 + pnpm 9 + cache).

Next steps:
- Gradually refactor services to import from `@arman/http-client` instead of `axios`.
- Expand smoke tests into unit/e2e; add coverage thresholds.
