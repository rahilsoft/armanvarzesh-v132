# Phase 7 — Debt closure: D12 PAYMENTS-WIRE + D11 dependency hygiene

## D12 — PAYMENTS-WIRE (closed)
`PaymentsModule` is now wired into `app.module` (it was unwired dead code
since before the consolidation) and gains `CheckoutController`:
`POST /payments/checkout` (create session), `/change-plan` (prorated),
`/webhook` (public PSP callback — idempotency enforced in CheckoutService
via `PaymentEvent.eventId @unique`), `/seed-products`. The full folded
Payments surface (checkout → order → subscription → entitlement outbox) is
now reachable over HTTP.

## D11 — undeclared workspace imports (closed for the backend)
All 8 `@arman/*` packages the backend imports are now declared as
`workspace:*` dependencies (`graphql-dataloader`, `graphql-utils`,
`observability`, `auth-kit`, `env-config`, `http-client`, `integration`,
`security-middleware`) — resolution no longer rides solely on tsconfig
path aliases; lockfile updated offline.

## Verification
typecheck exit 0 · lint exit 0 · npm test 35 suites / 115 tests green.
