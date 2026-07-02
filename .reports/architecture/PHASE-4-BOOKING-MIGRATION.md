# Phase 4 — Booking domain: migration report

Branch `claude/project-completion-phase-next`. Canonical: **modular monolith,
Int PKs** (`app/backend/src/reservations`).

## Artifact classification (booking-service)

| Artifact | Class | Action |
|---|---|---|
| `Slot` (capacity/hold), `Booking` models | Canonical (unique) | **Folded** (String cuid ids → Int PKs; FKs to User/Slot added) |
| holds/capacity/overlap/reschedule/confirm/expire logic | Canonical (unique) | **Ported** to `BookingService` (typed) |
| `Audit` model | Dead (unused by its own service) | Superseded by canonical `AuditLog`; not ported |
| `utcToTz` helper | Legacy | Not ported (Intl formatting belongs to the client/edge) |
| service bootstrap | Legacy infra | Retired with the service |

## Key changes

- Canonical schema **52 → 54 models**; `Reservation` gained
  `@@unique([id, version])` — the optimistic-locking key its service code
  always assumed but the schema never had.
- **BOOKING-DRIFT erased:** the 4 `@ts-expect-error` markers left by the
  stability commit are gone; `ReservationService`'s Prisma paths now compile
  against real models (Slot lookup fills the reservation window; cancel uses
  the compound key; string↔Int mapped at the legacy boundary via
  `toLegacyReservation`).
- `ReservationsModule` was **dead code**: not imported by `app.module`, its
  controller unregistered, no `PrismaService` provider (so the service always
  silently fell back to memory mode). Now fully wired.
- Port quality: injected PrismaService (one less rogue `PrismaClient`),
  `crypto.randomUUID` hold tokens, overlap checks in one query
  (`include: { slot }`), `paymentId` → `paymentRef` (Payments-domain
  convention), confirmPayment idempotent.

## Verification (this commit)

- `npm run typecheck` → exit 0 (client regenerated, 54 models)
- `npm run lint` → exit 0
- `npm test` → 22 suites / 69 tests green (7 new booking tests)
- Migration `20260702000003_booking_domain_fold/migration.sql` (49 lines)
  generated via `prisma migrate diff` from the saved pre-fold schema.

## Staged (gated)

**BOOKING-RETIRE:** physical deletion of `services/booking-service` after CI
runtime validation + infra rewire. Note: `payments-service`'s old synchronous
`BOOKING_URL` call was already replaced by the outbox event on the Payments
side; `/booking/payments/success` is the consumer endpoint.

## Technical-debt delta

- Closed: BOOKING-DRIFT (4 markers), one more rogue PrismaClient, dead
  module wiring.
- `Slot` name overlap with `medical-service`'s Slot remains a *different
  bounded context* (clinical scheduling) — handled at the Medical fold.
