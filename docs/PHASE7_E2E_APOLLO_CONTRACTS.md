# Phase 7 — e2e wiring + Nest GraphQL v12 deps + contracts compat
Date: 2025-08-18

Done:
1) **Deps:** Bumped @nestjs/graphql → ^12 and graphql → ^16 across packages (removed apollo-server-express if found).
2) **e2e:** Added real app bootstrap + health/auth/payments tests (auth/pay controlled by ENV flags) and Jest e2e config.
3) **Contracts:** New package `@arman/contracts-tests` with snapshot-based export compatibility tests and CI workflow.

To run:
- Backend e2e: `cd app/backend && pnpm test:e2e` (set E2E_* env for auth/pay).
- Contracts compat: `pnpm -r --filter ./packages/contracts-tests test`
