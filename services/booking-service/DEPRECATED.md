# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Booking** domain lives in the modular monolith at
`app/backend/src/reservations` (`ReservationsModule`, now wired in
`app.module`), per `.reports/architecture/DOMAIN-OWNERSHIP.md`.

## What was migrated (commit-verified)

- **Schema:** `Slot` (capacity + hold token/expiry) and `Booking`
  (PENDING|CONFIRMED|CANCELLED, mode, paymentRef) folded into the canonical
  schema with core **Int** PKs and real FKs (`Booking.userId → User`,
  `Booking.slotId → Slot`); `Reservation` gained the `(id, version)` compound
  unique for optimistic locking. Migration:
  `app/backend/src/database/prisma/migrations/20260702000003_booking_domain_fold/`.
  This service's `Audit` model was **unused by its own code** and is
  superseded by the canonical `AuditLog` (classified Dead).
- **Logic:** `BookingService` — slot creation, 10-min holds, capacity
  enforcement, user-overlap rejection, reschedule, idempotent payment
  confirmation, stale-hold/PENDING expiry. Typed port; injected
  `PrismaService` replaces the private `new PrismaClient()`; hand-rolled
  pseudo-uuid replaced by `crypto.randomUUID`; the per-booking slot-lookup
  loops (N+1) replaced with single `include: { slot }` queries.
- **REST:** same `/booking/*` routes (`slots/create`, `create`, `cancel`,
  `reschedule`, `hold`, `payments/success`, `mine`, `cron/expire`) — ids are
  now Int. `/booking/payments/success` is the receiving end of the Payments
  domain's `BOOKING_PAYMENT_SUCCEEDED` outbox event.
- The 4 BOOKING-DRIFT `@ts-expect-error` markers in `reservation.service.ts`
  are **erased** — its Prisma paths now compile against the real canonical
  models (Slot lookup + `(id, version)` optimistic cancel).
- Covered by `app/backend/src/reservations/__tests__/booking.service.spec.ts`
  (7 tests, green).

## Why this service is not yet deleted

Retirement gated on CI runtime validation (real Postgres) + infra rewire —
G1–G4 in `.reports/architecture/BASELINE-v0.3/RETIREMENT-MATRIX.md`
(**BOOKING-RETIRE**). Do not add new features here.
