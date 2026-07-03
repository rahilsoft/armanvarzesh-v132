# Production Acceptance Audit — Independent

Auditor role (not engineer). Every finding below is reproduced from the
repository at `HEAD` (`d180492`), not from prior reports. Commands are shown
so each is independently repeatable.

## VERDICT: ❌ NOT PRODUCTION READY

2 × P0 (release blockers) and 4 × P1 (must-fix) are present. Per the acceptance
protocol, production readiness is **withheld**; an elimination plan follows.

The prior "Build passing / Production readiness" claims measured
`npm run typecheck` (which passes) — **not** `npm run build`, which fails. The
canonical *folded* code is genuinely high quality (0 `@ts-ignore`, 0
`Promise<any>`, 0 TODO across ~20 new service files); the blockers are in
**security wiring, the emit build, deployment artifacts, and transactional
integrity** — none of which the unit-test gate exercises.

---

## P0 — Release Blockers

### P0-1 · Broken access control / user impersonation (OWASP A01)
Every folded controller takes the acting `userId`/`clientId` from the **request
body** and has **no authentication guard**. Only 3 of 55 controllers use
`@UseGuards`; none of the folded ones do.
- Evidence: `grep -rl UseGuards src/**/*controller*` → 3; `booking.controller.ts`,
  `checkout.controller.ts`, `medical.controller.ts`, `physio.controller.ts`,
  `courses.controller.ts`, `assessments.controller.ts`,
  `gamification.controller.ts`, `nutrition/controllers/tracking.controller.ts`,
  `marketplace/controllers/marketplace.controller.ts` → `guards=0` each; DTOs
  carry `@IsInt() userId!` (e.g. `checkout.controller.ts:12`,
  `booking.controller.ts:18`).
- Impact: any unauthenticated caller can `POST /payments/checkout {userId:N}`,
  book/cancel appointments, complete physio sessions, claim badges, issue
  certificates, mark meals — **as any user N**. Complete authorization bypass.

### P0-2 · Payment/medical webhook forgery
`POST /payments/checkout/webhook` and `POST /medical/webhooks/results-ready`
perform **no signature/HMAC verification**.
- Evidence: `grep -n signature\|hmac checkout.controller.ts checkout.service.ts` →
  none; idempotency is keyed only on caller-supplied `eventId`.
- Impact: an attacker POSTs `{type:'payment_succeeded', payload:{sessionId,
  paymentId}}` to mark orders paid, grant `ENTITLEMENT_GRANTED` (Pro tier), and
  confirm appointments — free premium + fake medical confirmations.

---

## P1 — Must Fix Before Production

### P1-1 · `npm run build` FAILS (deployable artifact cannot be produced)
`npm run build` (`tsc -p tsconfig.json`, `rootDir: src`) exits **2**:
`TS6059` on every `@arman/*` / `@contracts/*` cross-package import (rootDir
violation), plus a real `TS2729` — `loaderFactory` used before initialization
in `src/leaderboard/leaderboard.resolver.ts:15` (and `workouts.resolver.ts:16`).
`npm run typecheck` (`tsconfig.build.json`, `rootDir ../..`) passes and masked
this. No `dist/` can be emitted from the documented build script.

### P1-2 · Dockerfile references a path that does not exist
`app/backend/Dockerfile` uses `apps/backend` throughout (repo path is
`app/backend`); the build step is masked with `|| true`; `CMD node
apps/backend/dist/main.js` targets a non-existent path. The image cannot build
or run the backend.

### P1-3 · No transactions on multi-write money/booking flows
`CheckoutService.webhook` writes `checkoutSession.update` + `order.create` +
`subscription.upsert` + `domainEventOutbox.create` **non-atomically**
(`grep -c '\$transaction' checkout.service.ts` → 0). A mid-sequence failure
leaves a paid session with no order/entitlement, or an entitlement with no
outbox event. Same pattern in `booking.service.ts`, `rewards.service.ts`,
`medical.service.ts`.

### P1-4 · E2E suite cannot compile (runtime-validation gate cannot pass)
`npm run test:e2e` → all 7 real suites `FAIL … Test suite failed to run`:
duplicate `class-validator` versions (0.14.1 vs 0.14.2) create incompatible
`INestApplication` types in `test/e2e/utils/test-app.ts:10`. The G2 runtime
validation the retirement wave depends on cannot execute as configured.

---

## P2 — Should Fix Soon

- **P2-1 Deployment drift (D3):** `docker-compose.yml`, `graphql-gateway`
  defaults, and `observability/prometheus.yml` still target DEPRECATED services
  (`auth-service`, `users-service`, `content-service`, …); the monolith is not
  in dev compose. `.env`-level topology does not match the consolidated code.
- **P2-2 Dead/duplicate modules:** 30 module files are not wired into
  `app.module` (`challenges/`, `leaderboard/`, `analytics/`, `wallet/`,
  `survey/`, `live/`, `notifications/`, …). `challenges`/`leaderboard` duplicate
  the folded `GamificationModule` domain — remove or wire.
- **P2-3 Health check:** only `GET /healthz` → `{ok:true}` (no readiness vs
  liveness split, no DB/Redis probe) — insufficient for k8s probes.
- **P2-4 Type debt (non-folded code):** 50 `Promise<any>`, 431 `: any`,
  12 TODO/FIXME in the legacy/pre-existing backend (folded code is clean).

## P3 — Future Improvement
Legacy admin-auth dead cluster (`auth.service.ts`, `auth.resolver.ts`,
`strategies/local.strategy.ts`); ADR directory consolidation (D16);
`test/legacy/` quarantine repair (D17); Auth TOTP/password-reset port; outbox
relay worker (`services/workers` still a stub).

---

## Passed checks (evidence-positive)
- Unit gate: `npm test` → 35 suites / 115 passing, 0 fail.
- Lint: `npm run lint` → exit 0. Typecheck: exit 0.
- Canonical Prisma schema **valid** (with `DATABASE_URL` set); 20 migrations;
  `0_init` byte-matches git history.
- Dev-secret fallbacks (`JWT_SECRET`, `CERT_SECRET`) **fail-fast in production**
  (`NODE_ENV==='production'` throw) — confirmed.
- Global rate limiting present (`APP_GUARD` ThrottlerGuard, 100/min).
- Folded service code: 0 `@ts-ignore`, 0 `Promise<any>`, 0 TODO; whitelisted
  writes; webhook/reward idempotency keys; certificate revocation enforced.

---

## Elimination plan (ordered; P0 → P1)

1. **P0-1 Auth guards** — introduce a `JwtAuthGuard` (the JWT strategy already
   exists) + a `@CurrentUser()` decorator; apply globally via `APP_GUARD` with a
   `@Public()` opt-out for webhooks/health. Change every folded controller to
   derive `userId` from `req.user`, delete the `userId` DTO fields. Add
   authz-ownership checks where a resource is addressed by id.
2. **P0-2 Webhook signatures** — verify an HMAC/provider signature header on
   `/payments/checkout/webhook` and `/medical/webhooks/results-ready` before any
   state change; mark both `@Public()`; keep eventId idempotency.
3. **P1-1 Build** — give the backend one emit tsconfig with `rootDir` covering
   the workspace (mirror `tsconfig.build.json`) or `composite`/project refs for
   `@arman/*`; fix the two `loaderFactory`-before-init resolvers.
4. **P1-2 Dockerfile** — `apps/backend` → `app/backend`, remove `|| true`, fix
   `CMD`.
5. **P1-3 Transactions** — wrap the checkout webhook and booking create flows in
   `prisma.$transaction`.
6. **P1-4 E2E** — pin a single `class-validator` version (pnpm override) so the
   e2e app type-checks; then run G2 in CI against real Postgres.

Only after P0-1, P0-2, P1-1…P1-4 are eliminated **and re-verified from the
repository** may production readiness be reconsidered.

---

## Resolution Log (Engineer Mode)

Fixes are applied one blocker per commit and re-verified against the
repository. Status updated as each lands.

- **P0-1 · Access control — RESOLVED** (`d92d7ac`). Added `@CurrentUser()` +
  `@Public()` decorators; made `JwtAuthGuard` reflector-aware. Guarded every
  folded controller (payments/checkout, booking, medical, physio, assessments,
  gamification, courses, nutrition tracking, wearables) with
  `@UseGuards(JwtAuthGuard)`, deriving identity from the JWT and deleting the
  client-supplied `userId` DTO fields / path params. Removed the wearables
  `x-user-id` header/query impersonation fallback. Public catalog reads stay
  `@Public()`. `marketplace` is a read-only public catalog (no body `userId`,
  no mutations) — no guard needed. Verified: typecheck ✓, lint ✓, 115 unit ✓.
- **P0-2 · Webhook forgery — RESOLVED** (`d92d7ac`). Added
  `verifyWebhookSignature()` (HMAC-SHA256 over canonical JSON, constant-time
  compare, fail-closed in production). Wired into the payments checkout
  webhook, booking `payments/success` callback, and medical results-ready
  webhook. The legacy `payments/webhook.controller.ts` already verified HMAC.
- **P1-1 · Build** — pending.
- **P1-2 · Dockerfile** — pending.
- **P1-3 · Transactions** — pending.
- **P1-4 · E2E** — pending.
