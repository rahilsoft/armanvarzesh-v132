# ⚠️ DEPRECATED — superseded by the modular monolith

The canonical **Payments** domain lives in the modular monolith at
`app/backend/src/payments`, per `.reports/architecture/DOMAIN-OWNERSHIP.md`.

The unique checkout/entitlement capability of this service (Product,
CheckoutSession, PaymentEvent, Order, DomainEventOutbox + the checkout → webhook
→ order → subscription → entitlement flow) has been folded into the monolith:

- Canonical schema gained `Product`, `CheckoutSession`, `PaymentEvent`, `Order`,
  `DomainEventOutbox` (core **Int** PKs; PSP identifiers preserved as
  `String @unique` external refs — `providerSessionId`, `eventId`). The existing
  canonical `Subscription` was extended with `planId`/`startedAt` and is keyed
  for the internal flow via `provider="internal"`, `externalId=userId`.
- Logic ported to `app/backend/src/payments/checkout.service.ts`
  (`CheckoutService`), covered by `__tests__/checkout.service.spec.ts` (6/6).
- The booking notification is now emitted to `DomainEventOutbox`
  (`BOOKING_PAYMENT_SUCCEEDED`) instead of a synchronous HTTP call to
  booking-service — removing a cross-service coupling.

## Why this service is not yet deleted

Retirement is gated on CI runtime validation (real Postgres) + infra rewire:
- `services/graphql-gateway` (no payments subgraph today, but confirm)
- `docker-compose.yml` — any `PAYMENTS_*` env / references
- `k8s/*payments*`, `observability/prometheus.yml` scrape target

Also pending: expose the checkout HTTP surface on the monolith behind the JWT
guard, and wire `PaymentsModule` into `app.module` (currently unwired). Do not
add new features here.
