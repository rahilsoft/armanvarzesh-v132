# Payments (Admin)

## Flows
- **PWA (Stripe):** create checkout session → webhook `checkout.session.completed` → Payment.succeeded → Subscription.active (optional).
- **Mobile (RevenueCat):** purchase in-app → RevenueCat webhook → Subscription.active/expired updates.

## Reconciliation
- Daily billing reconciliation runs as a repeatable BullMQ job (`billing:reconcile`) to detect drifts (skeleton).

## Refunds
- For Stripe: process refund in Stripe dashboard → webhook `charge.refunded` → Refund record created and Payment marked `refunded`.
