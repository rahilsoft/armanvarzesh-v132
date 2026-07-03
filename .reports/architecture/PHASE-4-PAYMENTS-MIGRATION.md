# Phase 4 — Payments domain: migration report

Branch `claude/project-completion-prompt-0y30ok`. Canonical: **modular monolith,
Int PKs** (the monolith payments module is the richer Stripe/Zarinpal
implementation). Unlike Auth/Users this was **not** a pure duplicate — the
service held real, missing capability.

## Artifact classification (payments-service)

| Artifact | Class | Action |
|---|---|---|
| `Product`, `CheckoutSession`, `PaymentEvent`, `Order`, `DomainEventOutbox` | Canonical (unique) | **Folded** into canonical schema (Int PK + String extref) |
| checkout / webhook / order / entitlement flow (`payments.service.ts`) | Canonical (unique) | **Ported** to `CheckoutService` |
| `Subscription` (planId/startedAt shape) | Overlaps canonical | **Merged** into existing canonical `Subscription` (extended) |
| Stripe/provider handling | Duplicate | Monolith already richer — not ported |
| service bootstrap (main/tracing/metrics) | Legacy infra | Retired with the service |

## Key design decisions (Int-PK core with provider ids preserved)

- Provider-linked entities keep the external id as a `String @unique` reference:
  `CheckoutSession.providerSessionId`, `PaymentEvent.eventId`. Internal entities
  (`Product`, `Order`) use Int PKs. `Product.code` preserves the former string
  slug (`plan-pro`) as a natural key.
- The pre-existing canonical `Subscription` (`provider`/`externalId`, Stripe-
  shaped) is **reused** for the plan flow via `provider="internal"`,
  `externalId=userId`; its `@@unique([provider,externalId])` doubles as the
  per-user key (avoids a duplicate Subscription model). Added `planId`,
  `startedAt`.
- Webhook idempotency preserved via `PaymentEvent.eventId @unique`.
- **Improvement:** the booking-success notification is emitted to
  `DomainEventOutbox` (`BOOKING_PAYMENT_SUCCEEDED`) instead of a synchronous
  `fetch()` to booking-service — decoupling the domains via the outbox pattern.

## Verification (this commit)

- **Typecheck:** `tsc -p tsconfig.build.json --noEmit` → exit 0 (regenerated
  canonical client).
- **Unit tests:** `src/payments/__tests__/checkout.service.spec.ts` — 6/6
  (checkout, unknown-product rejection, full payment_succeeded flow, webhook
  idempotency, booking outbox event, changePlan proration).

## Staged (gated) — not done here

- `CheckoutService` is registered in `PaymentsModule` (DI-available, type-safe)
  but **no live HTTP endpoint** yet: `PaymentsModule` is not wired into
  `app.module` (it was already unwired pre-fold). Follow-up: wire it + a
  JWT-guarded `CheckoutController` (checkout/change-plan) + public idempotent
  webhook route.
- Physical retirement of `services/payments-service` pending CI runtime
  validation + infra rewire (see `DEPRECATED.md`). Tracked as **PAYMENTS-RETIRE**
  alongside AUTH-RETIRE, USERS-RETIRE.

## Technical-debt delta

- Recovered previously-missing capability (orders/checkout/entitlements) into the
  canonical model with no PSP-id loss.
- New follow-ups: PAYMENTS-WIRE (HTTP surface), PAYMENTS-RETIRE (infra),
  reconcile the two monolith `Subscription` usages (Stripe vs internal) into one
  documented lifecycle.
