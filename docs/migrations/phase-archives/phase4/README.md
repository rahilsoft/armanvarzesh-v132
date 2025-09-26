# Phase 4 — Payments (Stripe + RevenueCat)

## Backend
- **Prisma models**: Payment, Subscription, Refund, WebhookEvent (+ enums).
- **Modules**: `PaymentsModule` with queue `billing` and processor handling Stripe/RevenueCat events.
- **Endpoints**:
  - `POST /payments/v1/checkout/session` (Stripe Checkout; DRY-RUN supported via `PAYMENTS_DRY_RUN=true`)
  - `POST /payments/v1/webhooks/stripe` (verify signature in prod)
  - `POST /payments/v1/webhooks/revenuecat`
  - `GET /payments/v1/users/{userId}/subscription`

## ENV
```
PAYMENTS_DRY_RUN=true
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RC_API_KEY=
RC_WEBHOOK_SECRET=
```

## Migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev -n payments_init
```

## E2E (outline)
- Start checkout (DRY-RUN) → create pending Payment.
- Simulate `checkout.session.completed` webhook → Payment.succeeded.
- Simulate RevenueCat webhook → Subscription.active.
- Simulate refund webhook → Refund created + Payment.refunded.
