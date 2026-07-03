# Stage 09 — API Audit (REST + GraphQL)

**Source of truth:** repository only.

---

## Findings

### P1-01 — No API versioning strategy across REST services
**Evidence:** `services/courses-service/src/courses.controller.ts:10` uses `@Controller('v1')` (path-versioned), but `services/payments-service/src/payments.controller.ts:5` uses `@Controller('payments')` (unversioned), and most services are unversioned. No `app.enableVersioning()` in bootstraps.
**Why it is a problem:** Mixed/absent versioning means breaking changes cannot be rolled out safely; clients (mobile apps that can't force-update) break on any change.
**Production impact:** Forced-breaking changes for installed mobile clients.
**Recommended fix:** Adopt uniform URI or header versioning via `enableVersioning`.
**Effort:** M. **Risk:** Medium.

### P1-02 — No idempotency on money endpoints at the `services/*` layer
**Evidence:** `services/payments-service/src/payments.controller.ts` `checkout`/`change-plan` accept POSTs with no `Idempotency-Key`. The webhook relies on a DB unique on `eventId` (`payments.service.ts:39`) but `checkout` has none. (An idempotency repo exists only in `app/backend/src/infra/idempotency.prisma.repo.ts`, not in `services/payments-service`.)
**Why it is a problem:** A retried `checkout` (network timeout, mobile retry) creates duplicate checkout sessions; `change-plan` can double-charge.
**Production impact:** Duplicate charges/sessions; poor retry safety.
**Recommended fix:** Require `Idempotency-Key` on non-idempotent money endpoints; dedupe.
**Effort:** M. **Risk:** High.

### P2-03 — Inconsistent error contract across services
**Evidence:** Global exception filters exist only in 3 apps (Stage 06 P2-03). `graphql-gateway` returns bespoke JSON (`{ ok:false, error:'Gateway not ready' }`, `main.ts:52`); Nest services return default Nest error shapes; `security-middleware/jwt.ts` returns `{ error:'invalid_token', message: e.message }` (leaks internal error text).
**Why it is a problem:** No unified error envelope; clients must handle N formats; `message: e.message` can leak internals (CWE-209).
**Production impact:** Client fragility; information disclosure in error messages.
**Recommended fix:** Standard error envelope + global filter; strip internal messages in prod.
**Effort:** M. **Risk:** Medium.

### P2-04 — Pagination/filtering/sorting not standardized
**Evidence:** A `packages/shared/src/pagination` helper exists, but service list endpoints (e.g. `mySub` returns `findFirst`, others return unbounded `findMany` without `take`/`skip`) do not consistently use it. Unbounded reads observed conceptually across list resolvers.
**Why it is a problem:** Unbounded list queries return entire tables → memory/latency blowups at scale (also Stage 10).
**Production impact:** OOM / slow queries on large tables.
**Recommended fix:** Enforce cursor pagination with max page size everywhere.
**Effort:** M. **Risk:** Medium.

### P3-05 — No explicit request timeouts on outbound calls
**Evidence:** `services/payments-service/src/payments.service.ts:68` `fetch(BOOKING_URL/...)` and `services/content-service` `fetch(videoUrl)` have no timeout/abort signal.
**Why it is a problem:** A hung upstream ties up the request/worker indefinitely → resource exhaustion.
**Production impact:** Cascading slowness under partial outage.
**Recommended fix:** `AbortController` timeouts + circuit breakers (a breaker exists in `app/backend/src/notifications/providers/sms.provider.ts`, not reused).
**Effort:** M. **Risk:** Medium.

---

## Positives (verified)
- Webhook idempotency via unique `eventId` (`payments.service.ts:39-42`).
- `app/backend` notification providers use a circuit breaker + backoff (`sms.provider.ts:25`).
- Shared pagination helper package exists.

## Stage score: **46/100** (API)
