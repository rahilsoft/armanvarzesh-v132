# Phase 4 — Orders/Marketplace domain: migration report

Canonical: **modular monolith, Int PKs** (`app/backend/src/marketplace`,
now wired — was another unwired dead module).

## Classification (marketplace-service)
| Artifact | Class | Action |
|---|---|---|
| `Item` (type/createdBy) | Overlap + unique fields | Folded into canonical `Marketplace` (extended in place) |
| `Purchase` | Duplicate of Payments `Order` | **Not ported** — purchases route through Payments Product/Order |
| whole service (no schema, in-memory arrays) | Stub | Retired |

## Key changes
- Schema: `Marketplace` +`type`/`createdBy` + index (migration
  `20260702000010`). Monolith service typed (`MarketplaceWriteInput` +
  whitelist, all `any`s removed), update guards missing items, type filter.
- Entity exposes new nullable fields; controller null-safety fixed; module
  wired into app.module.

## Verification
typecheck exit 0 · lint exit 0 · npm test 29 suites / 96 tests green (2 new).

## Staged
**MARKETPLACE-RETIRE** (CI G2 + infra G3 gates).
