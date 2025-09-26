# Payments & Privacy Checklist (Phase H)
- [ ] Webhook signature verification (e.g., Stripe: `STRIPE_WEBHOOK_SECRET`)
- [ ] Raw body for webhooks (avoid body-parser JSON on webhook route)
- [ ] Mask card/PAN/IBAN in logs and responses (`sanitizePaymentPayload`)
- [ ] Rate limit `/payments/*` endpoints (config via `PAYMENTS_RATE_LIMIT`)
- [ ] No storage of CVV/CVC; redact in transit
- [ ] PCI scope minimization (avoid touching raw card data in backend)
- [ ] Audit trail for refunds/chargebacks
