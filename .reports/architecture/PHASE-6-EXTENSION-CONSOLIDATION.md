# Phase 6 — Extension-layer consolidation

Per the ownership map §B (one canonical service per extension domain).

## Notifications
- `inbox-service` → **notifications-service**: `NotificationInbox` model
  handed off into the canonical schema (client regenerated). inbox-service
  DEPRECATED.
- (DeviceToken/NotificationTask already handed off in content step 7.)

## Analytics
- `analytics-collector` + `kpis-service` → **analytics-service**: the
  canonical service previously had **no schema at all**; it now owns
  `Event` (idempotent ingestion via `idemKey @unique`, user/name+ts indexes)
  and `KpiDaily` (daily rollup) — folded from the collector. prisma +
  @prisma/client declared (the D11 pattern again); client generated;
  `prisma validate` passes. Both source services DEPRECATED.

## Retirement staging (EXTENSION-RETIRE)
inbox-service, analytics-collector, kpis-service join the gated wave —
deletion after CI runtime validation + infra rewire (prometheus scrape
targets, compose references).

## Verification
Backend gates unaffected (no monolith change): typecheck exit 0 · lint
exit 0 · npm test 35 suites / 115 green. Extension schemas validate; clients
regenerate offline.
