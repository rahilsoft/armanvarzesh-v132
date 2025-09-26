# Payments Service (Checkout → Entitlement)

Implements checkout sessions, idempotent webhooks, order/subscription creation, entitlement events, booking confirmation handoff, and plan change with proration.

## Models
- `Product{kind: plan|booking, amountCents, currency, interval?}`
- `CheckoutSession{status: open|paid|...}`
- `PaymentEvent{eventId unique}` (idempotency)
- `Order`, `Subscription`
- `DomainEventOutbox{ENTITLEMENT_GRANTED}`

## API
- `POST /payments/seed` → ایجاد محصولات نمونه (Basic/Pro)
- `POST /payments/checkout` `{ productId, metadata? }` → `{ sessionId, checkoutUrl, amountCents, currency }`
- `POST /payments/webhook` `{ provider, eventId, type, payload }` → **idempotent**
- `POST /payments/change-plan` `{ newPlanId }` → proration ساده + جلسهٔ جدید

### Flow
1) Checkout session → پرداخت در PSP  
2) PSP Webhook `payment_succeeded` →  
   - ایجاد `Order`  
   - اگر `plan`: upsert `Subscription` + رویداد `ENTITLEMENT_GRANTED`  
   - اگر `booking`: `POST /booking/payments/success` (با `bookingId` در metadata)

### Money
- همهٔ مقادیر در **minors** (cent) و **currency=EUR** مگر خلافش تعیین شود.

### Idempotency
- وبهوک با `PaymentEvent.eventId` یونیک؛ درخواست تکراری بی‌اثر است.
