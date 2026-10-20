# Mock / Stub / Placeholder Inventory (ROADMAP 0.8, first half)

Scanned 2026-10-19 (ripgrep, production code only). Scope: `app/backend/src`, `apps/web-site`, `apps/admin-web/src`, `apps/mobile-user`, `mobile/coach`, `packages/*/src`. Excluded: node_modules, dist, spec/test files, `__tests__`, `__mocks__`, `test(s)/` folders, `.md`. UI `placeholder=` attributes and test-only hits were skipped as false positives.

Notes: `.claude/agents/qa-test-engineer.md` and `CLAUDE.md` do not exist in this worktree, so the task brief was used as the role definition. `mobile/coach` holds only `app.json`/`package.json`/README (no source), so it has no hits. No GraphQL resolver with `return []` + TODO was found.

Severity: P0 = production request path returns fake data or bypasses a real provider; P1 = feature is a stub/no-op or an insecure default that can reach prod; P2 = dev-only, example files, cosmetic.

## Summary

Counted per distinct site (a row that lists several files counts each site once; the 17 admin-web placeholder pages and the 3 notification providers count individually).

| Severity | Count |
|---|---|
| P0 | 9 |
| P1 | 18 |
| P2 | 41 |
| **Total** | **68** |

## Burn-down order (top 10)

1. #1 `PAYMENT_PROVIDER` defaults to `mock`; mock verifies any callback as OK (free purchases possible in prod).
2. #2 Zarinpal provider falls back to a fake "OK" redirect when `APP_ENV !== 'production'` (unset env in prod = gateway bypass).
3. #8 FCM/APNs/WebPush providers are empty no-ops, yet the job is marked `delivered`.
4. #9 SMS provider defaults to `mock` (console.log of body, including OTPs); nothing is sent.
5. #12 `MatchingService` ranks coaches with `Math.random()` per criterion.
6. #13 Mobile login accepts any credentials and signs in with `demo-token`.
7. #3 Legacy `service/zarinpal.service.ts` posts to `example.com`; `service/payment.service.ts` never persists transactions (#4).
8. #10 Email notification channel not implemented but counted as sent.
9. #14/#15 Admin-web `Guarded` always allows and `useRoles` hard-codes `['admin']` (client-side RBAC bypass).
10. #17 Mobile register is a stub (no mutation).

## Payments

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 1 | app/backend/src/payments/providers/payment.provider.ts:27-40 | mock / insecure-default | payments | P0 | backend-payments | `PAYMENT_PROVIDER \|\| 'mock'`; MockPaymentProvider returns `MOCK-` authority and verifies OK for any or missing status. Fail startup in production unless a real provider is set; gate mock behind non-prod. |
| 2 | app/backend/src/payments/providers/payment.provider.ts:64-67 | fake-data / bypass | payments | P0 | backend-payments | Zarinpal error or missing `zarinpal-checkout` dep returns fake `ZP-FALLBACK` OK redirect when `APP_ENV !== 'production'`. Invert (fallback only when `APP_ENV==='development'`), prefer throwing. |
| 3 | app/backend/src/service/zarinpal.service.ts:6,16 | stub / fake-url | payments | P0 | backend-payments | Posts to `https://example.com/zarinpal/{request,verify}`; used by `resolver/payment.resolver.ts` via `service/payment.service`. Delete or replace with real gateway. |
| 4 | app/backend/src/service/payment.service.ts:24,41 | stub | payments | P1 | backend-payments | Transactions never saved/updated ("(mock)", commented-out repository calls); hard-coded sandbox StartPay URL. |
| 5 | app/backend/src/payments/queue/billing.processor.ts:76 | TODO / stub | payments | P1 | backend-payments | Daily reconcile is a log-only skeleton; implement drift detection. |
| 6 | app/backend/src/payments/reconciliation.service.ts:17 | stub | payments | P2 | backend-payments | Provider API check "not implemented here"; merge with #5. |
| 7 | app/backend/src/lib/data/repositories/payment.repository.ts:30 | fake-data | payments | P2 | backend-payments | Random fallback authority when no idempotency key; use `crypto.randomUUID()` and require a key. |

## Notifications

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 8 | app/backend/src/notifications/providers/{fcm,apns,webpush}.provider.ts:8 | stub / TODO | notifications | P0 | backend-notifications | `send()` body is empty; processor then marks log `delivered`. Integrate SDKs or mark failed. (3 sites) |
| 9 | app/backend/src/notifications/providers/sms.provider.ts:8-17 | mock / insecure-default | notifications | P0 | backend-notifications | `SMS_PROVIDER \|\| 'mock'` logs body to console. Fail fast in prod; never log bodies. |
| 10 | app/backend/src/notifications/queue/notification.processor.ts:39 | stub | notifications | P1 | backend-notifications | `email` branch is empty but sets `sentAny = true`. Implement or fail. |
| 11 | app/backend/src/notifications/providers/sms.provider.ts (Kavenegar, ~L30) | placeholder | notifications | P1 | backend-notifications | Comment says SDK call is "a placeholder"; verify real call style and add contract test. |

## Matching / Coaches

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 12 | app/backend/src/matching/matching.service.ts:58-80 | fake-data (Math.random scoring) | matching | P0 | backend-matching | Eight score weights multiplied by `Math.random()` plus jitter; ranking is non-deterministic. Use real metrics (cf. `coaches/specialist-scoring.service`). |

## Auth

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 13 | apps/mobile-user/src/screens/auth/LoginScreen.tsx:22-24 | stub / bypass | mobile-user | P0 | mobile-user | Fake 600ms delay then `signIn('demo-token')` for any input. Wire to real login mutation. |
| 14 | apps/admin-web/src/rbac/Guarded.tsx:4-5 | stub / bypass | admin-web | P1 | admin-web | `allowed = true` always; backend must still enforce. |
| 15 | apps/admin-web/src/rbac/useRoles.ts:2-3 | stub / bypass | admin-web | P1 | admin-web | Returns hard-coded `['admin']`. |
| 16 | apps/admin-web/src/rbac/audit.ts:3 | TODO | admin-web | P1 | admin-web | Audit events not sent to backend. |
| 17 | apps/mobile-user/src/screens/auth/RegisterScreen.tsx:23 | stub | mobile-user | P1 | mobile-user | Register mutation missing. |
| 18 | apps/web-site/src/lib/api.ts:5 | TODO | web-site | P2 | web-site | `getToken: () => null`; wire to auth cookie/session. |
| 19 | apps/web-site/app/login/page.tsx:5 | fake-data | web-site | P2 | web-site | Prefilled `specialist@example.com`. |

## Admin-web placeholder pages

Each renders `<div>{module} — admin list</div>` with `// TODO: wire to /admin/<module>` at `apps/admin-web/src/views/modules/<module>/List.tsx:3`.

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 20 | .../modules/analytics/List.tsx:3 | TODO | admin-web | P1 | admin-web | Wire to `/admin/analytics`. |
| 21 | .../modules/{nutrition,payments,physio,workouts,coaches,courses,assessments,notifications,chat,rewards,booking,vip,marketplace,monitoring,certificate,affiliate,ai}/List.tsx:3 | TODO | admin-web | P2 | admin-web | 17 pages; wire or hide from nav until ready. Prioritise payments and coaches. |

## Gamification / Challenges / Courses

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 22 | app/backend/src/challenges/challenges.service.ts:13 | stub | challenges | P1 | backend-gamification | `join` only verifies existence ("participant tracking not implemented") but returns ok. Persist participation. |
| 23 | app/backend/src/courses/courses.service.ts:99 | insecure-default | courses | P1 | backend-courses | Certificate verify URL defaults to `https://example.com/verify`; require `CERT_VERIFY_URL` in prod. |
| 24 | app/backend/src/gamification/rewards.service.ts:87 | fake-data | gamification | P2 | backend-gamification | Referral code from `Math.random()`; use crypto RNG. |

## Backend infra / stubs

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 25 | app/backend/src/dataloader.ts:1 ; app/backend/src/service/user.service.ts:1 | stub | backend | P1 | backend-core | "AUTO-GENERATED STUB" exporting `__stub = true`; check importers, delete or implement. (2 sites) |
| 26 | app/backend/src/queues/workers/{resize,transcode}.worker.example.ts:8 ; packages/integration/src/queues/workers/test.worker.example.ts:8 | TODO / example | queues | P1 | backend-media | Handlers unimplemented; confirm not registered in prod modules. (3 sites) |
| 27 | app/backend/src/scripts/seed.ts:7 | fake-data | backend | P2 | backend-core | Seed user `u1@example.com`; dev only. |
| 28 | app/backend/src/observability/metrics.ts:33 | stub (no-op fallback) | observability | P2 | devops | No-op counter fallback; acceptable, document. |
| 29 | app/backend/src/livekit/livekit.service.ts:10 | placeholder | livekit | P2 | backend-live | Empty `LIVEKIT_HOST` default; fail fast when missing. |
| 30 | apps/web-site/app/api/analytics/route.ts:7 | TODO | web-site | P1 | web-site | Analytics route only logs; telemetry dropped. |

## Insecure localhost / example.com defaults (prod code)

| # | path:line | kind | module | sev | owner | fix note |
|---|---|---|---|---|---|---|
| 31 | app/backend/src/storage/storage.service.ts:14 | insecure-default | storage | P1 | backend-core | `S3_ENDPOINT \|\| 'http://localhost:9000'`; require in prod. |
| 32 | packages/storage/src/index.ts:9,16 ; provider.ts:11 | insecure-default | storage | P2 | backend-core | Recordings base URL defaults to localhost:9000. (3 sites) |
| 33 | app/backend/src/{mediaqueue/mediaqueue.service.ts:7, reminders/reminders.service.ts:10, common/idempotency/idempotency.service.ts:17} | insecure-default | backend | P2 | backend-core | `REDIS_URL \|\| redis://localhost:6379`; validate via env-config at boot. (3 sites) |
| 34 | app/backend/src/otel/bootstrap.ts:16 | insecure-default | observability | P2 | devops | OTLP endpoint defaults to localhost:4318. |
| 35 | apps/web-site/src/constants/config.ts:2 ; components/{SignedImage,EnqueueDemo}.tsx ; app/login/page.tsx:10 ; app/specialist/chat/[threadId]/page.tsx:20 | insecure-default | web-site | P2 | web-site | API/auth/WS base URLs default to localhost; centralise and require in prod build. (5 sites) |
| 36 | apps/web-site/next-sitemap.config.js:1 ; app/sitemap.ts:3 ; app/robots.ts:3 | insecure-default | web-site | P2 | web-site | Site URL defaults to example.com/localhost; wrong sitemap/robots in prod. (3 sites) |
| 37 | apps/web-site/app/me/nutrition/upload/page.tsx:9 | fake-data | web-site | P2 | web-site | Default photo URL `https://example.com/meal.jpg`. |

## Reviewed, not flagged

`Math.random()` for request IDs (`packages/http-client/src/client.ts:92`), analytics session id, LiveKit guest identity, retry jitter (`common/retry/circuitBreaker.ts:13`); `DUMMY_HASH` in `auth/user-auth.service.ts` (intentional timing equalisation). Hardening follow-ups: PKCE verifier/state in `apps/web-site/app/admin/login/page.tsx:22,25` should use `crypto.getRandomValues`; `packages/infra/src/idempotency.ts:11` has an `@todo` to return the cached value.
