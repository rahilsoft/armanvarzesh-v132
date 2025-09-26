# Release Notes — Phase 15 (Reservations with Prisma)
Date: 2025-08-19

## Prisma
- Added `Reservation` model with proper indexes and unique(slotId)
- Schema updated at: apps/backend/src/database/prisma/schema.prisma

## Backend
- ReservationService now DB-backed:
  - reserve(userId, slotId), cancel(id), listByUser, listByCoach
- Resolver: `userReservations(userId)`, `coachReservations(coachId)`

- Phase 1B: Added physio-subgraph (GraphQL federation), wired to physio-service REST; added smoke tests.

- Phase 1D: RBAC/ABAC guards in physio-service (JWT ownership checks), added GraphQL Supergraph Gateway, and schema contract snapshot tests.

- Phase 5: Added booking-service (UTC slots, holds, payments webhook, overlap guards, DST-safe), wired User/Coach UIs, and e2e tests for DST/overlap.

- Phase 6: Added analytics-collector (track events, privacy hash, idempotency) + KPIs service (DAU/MAU, conversion, adherence, CSV export) and Coach admin dashboard.

- Phase 7: Added ai-service (suggestions/readiness/coach-match) with model snapshots, feature vectors, deterministic seed, NaN guards, and demo screens.

- Phase 8: Added activities-service (routes, live ticks, end stats, invites) + smoothing/Haversine + unit tests + user-app demo.

- Phase 8: Added activities-service (routes, live ticks, stats, smoothing, invites), RN live demo, and tests for smoothing/unit conversions/pause semantics.

- Phase 9: Added chat-service (Socket.IO, read receipts, typing, presigned uploads, AV webhook) + tests for ordering/dedup/offline semantics.

- Phase 10: Added notifications-service (templates, scheduler, quiet-hours, retry, ICS) with preview & outbox APIs.

- Phase 11: Added payments-service (checkout, webhook, orders/subscriptions, entitlement outbox, proration, booking confirm handoff).

- Phase 13: User App wiring: workouts optimistic+offline queue; nutrition logging; booking (TZ/holds/cancel/resched); payments (web checkout + entitlements refresh); notifications deep links; linking config.

- Phase 14: Added coach-service (program builder, publish immutability, assignments, roster adherence, payouts) and Coach PWA wiring: ProgramBuilder, Roster, Payouts.
