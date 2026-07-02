# Backend test layers

Normalized in the Architecture Stability Commit. Every suite lives in exactly
one layer; jest scripts scope by path.

| Layer | Location | Runs | Gate | Script |
|---|---|---|---|---|
| **Unit** | `src/**/__tests__/` (domain-isolated, in-memory mocks) + `test/unit/` (cross-cutting: guards, controllers-with-mocks, utilities) | anywhere, no infra | **must be green on every commit** | `npm test` (`jest src test/unit`) |
| **Integration** | `test/integration/` | needs a real PostgreSQL (`DATABASE_URL`) | CI job with Postgres service | `npm run test:integration` (`--passWithNoTests` until first suite lands with the CI-validation workstream) |
| **E2E** | `test/e2e/` (boots the Nest app via `utils/test-app.ts`, drives HTTP with supertest) | needs the full stack (DB, Redis where used) | CI e2e job | `npm run test:e2e` |
| **Legacy (quarantined)** | `test/legacy/` | — | none; tracked as debt **D17 TEST-ESTATE** | `npm run test:legacy` |

`npm run test:all` runs everything (expected red outside CI: e2e needs a live
stack; legacy is quarantined).

## Rules

- New domain logic ships with unit tests in `src/<domain>/__tests__/`.
- A spec that needs `DATABASE_URL` goes in `test/integration/`, never in unit.
- No placeholder tests: suites asserting only `expect(true)` are deleted on
  sight (several fake-green "e2e" placeholders were removed in the stability
  commit — they squatted on the `.spec.ts` names while the real e2e suites,
  named `*.e2e-spec.ts`, were invisible to jest's `testMatch`).

## Why `test/legacy/` exists

These are pre-existing scaffold stubs written against APIs that no longer
exist (old service constructors, removed controllers, a vitest+testcontainers
suite without its runner). They are kept out of every gate but preserved for
reference until each is repaired against the canonical implementation or
deleted in its domain's fold. Do not add files here.
